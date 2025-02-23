import CustomButton from "@/components/CustomButton";
import ItemCard from "@/components/ItemCard";
import { RecordContext } from "@/contexts/RecordsContext";
import { getAllItemsFromServer, getRecordsFromServer } from "@/repository/NetworkRepository";
import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { showMessage } from "react-native-flash-message";

type Project = {
  id: number;
  name: string;
  status: string;
  members: number;
};

const AnalyticsScreen = () => {
  const [topBooks, setTopBooks] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTopBooks = async () => {
    setIsLoading(true);
    try {
      const books: Item[] = await getRecordsFromServer();

      if (books.length === 0) {
        showMessage({
          message: "No books available!",
          type: "warning",
          duration: 2000,
        });
        setTopBooks([]);
        return;
      }

      // Sort alphabetically by genre and ascending by quantity
      const sortedBooks = books
        .sort((a, b) => {
          if (a.genre < b.genre) return -1;
          if (a.genre > b.genre) return 1;
          return a.quantity - b.quantity;
        })

      setTopBooks(sortedBooks);
    } catch (error) {
      showMessage({
        message: "Failed to load books!",
        type: "warning",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopBooks();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : topBooks.length > 0 ? (
        <FlatList
          data={topBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <ItemCard item={item}/>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", fontSize: 18, marginTop: 20 }}>
          No books found.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default AnalyticsScreen;