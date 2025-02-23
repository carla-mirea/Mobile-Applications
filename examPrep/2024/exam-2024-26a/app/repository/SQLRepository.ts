import { SQLiteDatabase } from "expo-sqlite";
import { deleteRecordFromServer, postRecordToServer } from "./NetworkRepository";

export async function createTable(dbConnection: SQLiteDatabase) {
  const createSyncQueueTableQuery = `
    CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recordId INTEGER NOT NULL,
        syncAction TEXT NOT NULL,
        payload TEXT NOT NULL
    );
  `;

  await dbConnection.runAsync(createSyncQueueTableQuery);

  const createFetchedTable = `
    CREATE TABLE IF NOT EXISTS Fetched(
      id INTEGER
    )
  `

  await dbConnection.runAsync(createFetchedTable);

  return dbConnection.runAsync(
    `
    CREATE TABLE IF NOT EXISTS Item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        details TEXT NOT NULL,
        status TEXT NOT NULL,
        members DECIMAL NOT NULL,
        type TEXT NOT NULL
    );
  `
  );
}

export async function getAllCategoriesDb(dbConnection: SQLiteDatabase): Promise<any[]> {
  console.log('Fetching all categories records from db...');
  return dbConnection.getAllAsync("SELECT * FROM Category");
}

export async function addCategoryRecordDb(dbConnection: SQLiteDatabase, category: string) {
  console.log('Adding category record to db...');

  return dbConnection?.runAsync(
    "INSERT OR REPLACE INTO Category (category) VALUES(?)", [category]
  );
}

export async function getAllFetchedRecordsDb(dbConnection: SQLiteDatabase): Promise<any[]> {
  console.log('Fetching all fetched records from db...');
  return dbConnection.getAllAsync("SELECT * FROM Fetched");
}

export async function getAllRecordsDb(dbConnection: SQLiteDatabase): Promise<Item[]> {
  console.log('Fetching all items from db...');
  return dbConnection.getAllAsync("SELECT * FROM Item");
}

export async function addFetchedRecordDb(dbConnection: SQLiteDatabase, recordId: number) {
  console.log('Adding fetch record to db...');

  return dbConnection?.runAsync(
    "INSERT OR REPLACE INTO Fetched (id) VALUES(?)", [recordId]
  );
}

export async function addRecordDb(dbConnection: SQLiteDatabase, record: Item) {
  console.log('Adding item to db...');

  return dbConnection?.runAsync(
    "INSERT OR REPLACE INTO Item (id, name, team, details, status, members, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [record.id, record.name, record.team, record.details, record.status, record.members, record.type]
  );
}

export async function clearLocalDb(dbConnection: SQLiteDatabase) {
  console.log('Clear local db...');

  return dbConnection?.runAsync("DELETE FROM Item");
}

export async function updateRecordDb(dbConnection: SQLiteDatabase, recordToUpdate: Item) {
  console.log('Update record in db...');

  return dbConnection?.runAsync(
    `UPDATE Item 
     SET name = ?, team = ?, details = ?, status = ?, members = ?, type = ?
     WHERE id = ?`,
    [
      recordToUpdate.name,
      recordToUpdate.team,
      recordToUpdate.details,
      recordToUpdate.status,
      recordToUpdate.members,
      recordToUpdate.type,
      recordToUpdate.id,
    ]
  );
}

export async function deleteRecordDb(dbConnection: SQLiteDatabase, recordId: number) {
  console.log('Delete record from db...');

  return dbConnection?.runAsync("DELETE FROM Item WHERE id = ?", [recordId]);
}

export async function clearSyncQueue(dbConnection: SQLiteDatabase) {
  console.log('Clear local db...');

  return dbConnection?.runAsync("DELETE FROM sync_queue");
}

export const addToSyncQueue = async (
    connection: SQLiteDatabase,
    recordId: number,
    syncAction: string,
    payload: string
  ) => {
    console.log('Add to sync queue...');

    await connection.runAsync(
      `INSERT INTO sync_queue (recordId, syncAction, payload)
       VALUES (?, ?, ?);`,
      [recordId, syncAction, payload]
    );
  };
  
  export const getSyncQueue = async (
    connection: SQLiteDatabase
  ): Promise<{ id: number; recordId: number; syncAction: string; payload: string }[]> => {
    console.log('Get sync queue...');

    const result = await connection.getAllAsync(`SELECT * FROM sync_queue`);
    return result.map((row: any) => ({
      id: row.id,
      recordId: row.recordId,
      syncAction: row.syncAction,
      payload: row.payload,
    }));
  };
  
  export const removeFromSyncQueue = async (
    connection: SQLiteDatabase,
    id: number
  ) => {
    console.log('Remove from sync queue...');

    await connection.runAsync(`DELETE FROM sync_queue WHERE id = ?;`, [id]);
  };
  
  export const syncPendingOperations = async (dbConnection: SQLiteDatabase) => {
    try {
      const pendingOperations = await getSyncQueue(dbConnection);
  
      for (const operation of pendingOperations) {
        const { id, recordId, syncAction, payload } = operation;
  
        try {
          if (syncAction === "UPDATE" && payload) {
            const record = JSON.parse(payload) as Item;
            await postRecordToServer(record);
          } else if (syncAction === "DELETE") {
            await deleteRecordFromServer(recordId); 
          }
  
          await removeFromSyncQueue(dbConnection, id);
        } catch (syncError) {
          console.error(`Failed to sync operation with id ${id}:`, syncError);
        }
      }
    } catch (error) {
      console.error("Error fetching pending operations from sync_queue:", error);
    }
  };