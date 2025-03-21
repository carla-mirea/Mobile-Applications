import CustomButton from "@/components/CustomButton";
import ItemCard from "@/components/ItemCard";
import { RecordContext } from "@/contexts/RecordsContext";
import { borrowBook, fetchReservedBooks } from "@/repository/NetworkRepository";
import { useRouter } from "expo-router";
import React from "react";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const recordsContext = useContext(RecordContext)!;
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Item[]>([]);

  const router = useRouter();

  if (recordsContext.isLoading) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.title}>Welcome</Text>

      {recordsContext.isLoaded == true ? (
        <ScrollView style={styles.itemsContainer}>
          {recordsContext.records.map((record, index) => (
            <ItemCard key={index} item={record} />
          ))}
        </ScrollView>
      ) : (
        <View>
          <Text>Transactions load failed!</Text>

          <CustomButton
            text="Retry"
            onPress={() => {
              setShowLoading(true);
              if (recordsContext.retryFetch !== undefined)
                recordsContext
                  .retryFetch()
                  .finally(() => setShowLoading(false));
            }}
          />
        </View>
      )}

      {showLoading && <ActivityIndicator />}

      <CustomButton
        text={"Add item"}
        onPress={() => router.navigate("/add-item")}
      />

      <CustomButton
        text={"Analytics"}
        onPress={() => router.push("/analytics")}
      />
      <CustomButton text={"Reserved Books"} onPress={() => router.push("/list")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    margin: 16,
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },

  title: {
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 24,
  },

  itemsContainer: {
    marginTop: 32,
  },

  item: {
    marginTop: 16,
  },

  failContainer: {
    marginTop: 32,
    alignItems: "center",
  },

  categoryItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedItem: {
    backgroundColor: "#d0d0d0", // Change background color when pressed
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  bookContainer: {
    marginBottom: 16,
  },
});
