import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { fetchReservedBooks, borrowBook } from "@/repository/NetworkRepository";
import { RecordContext } from "@/contexts/RecordsContext";
import ItemCard from "@/components/ItemCard";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";

const ListScreen = () => {
  const [reservedBooks, setReservedBooks] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const recordsContext = useContext(RecordContext)!;

  if (!recordsContext) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  const fetchReservedBooks = async () => {
    setLoading(true);
    if (recordsContext.getReservedBooks) {
      const result = await recordsContext.getReservedBooks();
      // console.log("Fetched books:", result); // Debugging log
    
      if (!result || result.length === 0) {
        console.log("No books found.");
      }

      setReservedBooks(result || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReservedBooks();
  }, []);


  if (loading) {
      return (
        <SafeAreaView style={styles.main}>
          <ActivityIndicator size="large" color="#000" />
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { flex: 1 }]}>
      <FlatList
        data={reservedBooks}
        renderItem={({ item }) => {
          // console.log("Rendering item:", item);
          return (
            <View style={styles.projectContainer}>
              <ItemCard item={item} />
              <Button title="Borrow" onPress={() => recordsContext.borrowRecord(item)} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  projectContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  main: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
});

export default ListScreen;
