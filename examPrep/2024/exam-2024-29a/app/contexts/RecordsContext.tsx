import {
  borrowBook,
  deleteRecordFromServer,
  fetchReservedBooks,
  getCategoriesFromServer,
  getRecordDetailsFromServer,
  getRecordsForCategoryFromServer,
  getRecordsFromServer,
  IP,
  postRecordToServer,
  updateRecordOnServer,
} from "@/repository/NetworkRepository";
import { SplashScreen } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import * as SQLite from "expo-sqlite";
import {
  addCategoryRecordDb,
  addFetchedRecordDb,
  addRecordDb,
  addToSyncQueue,
  clearLocalDb,
  clearSyncQueue,
  createTable,
  deleteRecordDb,
  getAllCategoriesDb,
  getAllFetchedRecordsDb,
  getAllRecordsDb,
  getSyncQueue,
  removeFromSyncQueue,
  updateRecordDb,
} from "@/repository/SQLRepository";
import NetworkContext from "./NetworkContext";

type RecordContextType = {
  records: Item[];
  categories: string[];
  addRecord: (record: Item) => Promise<void>;
  updateRecord: (record: Item) => Promise<void>;
  deleteRecord: (recordId: number) => Promise<void>;
  getRecords: () => Promise<void>;
  getRecordDetails?: (recordId: number) => Promise<Item | null>;
  isLoaded?: boolean;
  isLoading: boolean;
  retryFetch?: () => Promise<void>;
  getRecordsList?: (category: string) => Promise<Item[]>;
  getReservedBooks?: () => Promise<Item[] | null>;
  borrowRecord: (record: Item) => Promise<void>;
};

export const RecordContext = createContext<RecordContextType | null>(null);

export default function RecordContextProvider({ children }: any) {
  const [records, setRecords] = useState<Item[]>([]);
  const [reservedBooks, setReservedBooks] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [fetchedFor, setFetchedFor] = useState<number[]>([]);

  const [retrievedFor, setRetrievedFor] = useState<number[]>([]);
  const [dbConnection, setDbConnection] = useState<SQLite.SQLiteDatabase>();

  const addRecord = async (record: Item) => {
    try {
      const receivedRecord = await postRecordToServer(record);
      await addRecordDb(dbConnection!, receivedRecord);

      setRecords((prevRecords) => [...prevRecords, receivedRecord]);
    } catch (error) {
      console.log("failed to save on server... fallback to local sync queue");
      let maxId =
        Math.max.apply(
          Math,
          records.map((project) => project.id)
        ) + 1;

      const receivedRecord = { ...record, id: maxId };

      await addRecordDb(dbConnection!, receivedRecord);

      await addToSyncQueue(
        dbConnection!,
        maxId,
        "ADD",
        JSON.stringify(receivedRecord)
      );

      setRecords((prevRecords) => [...prevRecords, receivedRecord]);

      showMessage({
        message: "Failed to post record!",
        type: "warning",
        duration: 2000,
      });
    }
  };

  const updateRecord = async (record: Item) => {
    try {
      // await updateRecordOnServer(record.id);
      // Update the record in the database
      await updateRecordDb(dbConnection!, record);
      console.log("received: ");
      console.log(record);

      // Update the record in the local state
      setRecords((prevRecords) =>
        prevRecords.map((item) => (item.id == record.id ? record : item))
      );
    } catch (error) {
      console.error("Error updating record:", (error as Error).message);
      showMessage({
        message: (error as Error).message,
        type: "warning",
        duration: 2000,
      });
    }
  };

  const deleteRecord = async (recordId: number) => {
    try {
      await deleteRecordFromServer(recordId);
      // await deleteRecordDb(dbConnection!, recordId);

      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id != recordId)
      );
    } catch (error) {
      showMessage({
        message: (error as Error).message,
        type: "warning",
        duration: 2000,
      });
    }
  };

  const borrowRecord = async (record: Item) => {
    try {
      await borrowBook(record.id);
      // await deleteRecordDb(dbConnection!, recordId);

      setRecords((prevRecords) =>
        prevRecords.map((item) => (item.id == record.id ? record : item))
      );

      setReservedBooks((prevRecords) =>
        prevRecords.map((item) => (item.id == record.id ? record : item))
      );
    } catch (error) {
      showMessage({
        message: (error as Error).message,
        type: "warning",
        duration: 2000,
      });
    }
  };

  const getRecords = async () => {
    try {
      if (records.length > 0) return;

      const result = await getRecordsFromServer();

      setRecords((prevRecords) => [...prevRecords, ...result]);
      setIsLoaded(true);
      for (let record of result)
        await addRecordDb(dbConnection!, record).catch((error) =>
          console.log(error)
        );
    } catch (error) {
      showMessage({
        message: (error as Error).message,
        type: "warning",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getReservedBooks = async () => {
    try {
      if (reservedBooks.length > 0) return reservedBooks;

      const result = await fetchReservedBooks();

      setReservedBooks((prevReservedBooks) => [
        ...prevReservedBooks,
        ...result,
      ]);

      return result;
    } catch (error) {
      showMessage({
        message: (error as Error).message,
        type: "warning",
        duration: 2000,
      });

      return null;
    }
  };

  const getRecordDetails = async (recordId: number) => {
    try {
      if (retrievedFor.find((record) => record == recordId))
        return records.find((record) => record.id == recordId)!;

      const result = await getRecordDetailsFromServer(recordId);
      await addFetchedRecordDb(dbConnection!, recordId);
      retrievedFor.push(recordId);

      return result;
    } catch (error) {
      showMessage({
        message: (error as Error).message,
        type: "warning",
        duration: 2000,
      });

      return null;
    }
  };

  async function loadRecordsFromDb(dbConnection: SQLite.SQLiteDatabase) {
    try {
      const records = await getAllRecordsDb(dbConnection);
      const fetchedRecords = await getAllFetchedRecordsDb(dbConnection);

      setRecords(records);
      setRetrievedFor([...new Set(fetchedRecords.map((entry) => entry.id))]);

      setIsLoaded(true);
      return records.length > 0;
    } catch (error) {
      showMessage({
        message: "Failed to load records!",
        type: "warning",
        duration: 2000,
      });
    }
  }

  const setupWebSocket = () => {
    const socket = new WebSocket(`ws://${IP}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = async (event) => {
      const receivedRecord: Item = JSON.parse(event.data);

      console.log(receivedRecord.title);

      setRecords((prevRecords) => {
        if (
          prevRecords.find((record) => record.id == receivedRecord.id) !=
          undefined
        )
          return prevRecords;

        return [...prevRecords, receivedRecord];
      });

      const formattedMessage = `New Book from author ${receivedRecord.author} named ${receivedRecord.title}, with genre ${receivedRecord.genre} has been added`;

      showMessage({
        message: formattedMessage,
        duration: 5000,
        type: "info",
      });
    };

    socket.onclose = () => console.log("WebSocket connection closed");
  };

  const syncItems = async (dbConnection: SQLite.SQLiteDatabase) => {
    //console.log("SyncItems called at", new Date().toISOString());

    const syncQueue = await getSyncQueue(dbConnection!);
    //console.log("Pending Sync Queue:", syncQueue);

    if (syncQueue.length == 0) return;

    for (let item of syncQueue) {
      console.log(`syncing: ${item}`);

      const { id, recordId, syncAction, payload } = item;

      const oldRecord = JSON.parse(payload);

      try {
        console.log(`Sending to server: ${JSON.stringify(oldRecord)}`);

        const receivedRecord = await postRecordToServer(oldRecord);
        console.log(`Server responded with: ${JSON.stringify(receivedRecord)}`);

        await removeFromSyncQueue(dbConnection!, id);
        await deleteRecordDb(dbConnection!, recordId);
        await addRecordDb(dbConnection!, receivedRecord);
        // remove temp entity and add the server one
        setRecords((prevRecords) => [
          ...prevRecords.filter((record) => record.id != oldRecord.id),
          receivedRecord,
        ]);
      } catch (error) {
        console.error("Error syncing record:", error);
      }
    }
  };

  const debugSyncQueue = async (dbConnection: SQLite.SQLiteDatabase) => {
    const queue = await getSyncQueue(dbConnection!);
    console.log("Current Sync Queue:", queue);
  };

  const checkIfOnline = async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  };

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const connection = SQLite.openDatabaseSync("books.db");

    // createTable(connection);
    // clearLocalDb(connection);

    async function loadData() {
      //const result = await loadRecordsFromDb(connection);

      //if (result) return;
      console.log("🧹 Clearing sync queue before app starts...");

      clearSyncQueue(connection);
      console.log("✅ Sync queue cleared!");

      // Now continue with normal initialization

      await getRecords();
    }

    loadData();

    setDbConnection(connection);
    createTable(connection);

    setupWebSocket();

    //debugSyncQueue(connection);

    setInterval(() => syncItems(connection), 15000);
  }, []);

  return (
    <RecordContext.Provider
      value={{
        records: records,
        categories: categories,
        addRecord: addRecord,
        updateRecord: updateRecord,
        deleteRecord: deleteRecord,
        getRecords: getRecords,
        isLoaded: isLoaded,
        isLoading: isLoading,
        retryFetch: getRecords,
        getRecordDetails: getRecordDetails,
        getReservedBooks: getReservedBooks,
        borrowRecord: borrowRecord,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
}
