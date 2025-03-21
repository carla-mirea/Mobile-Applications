import CustomButton from "@/components/CustomButton";
import ItemCard from "@/components/ItemCard";
import { RecordContext } from "@/contexts/RecordsContext";
import { useRouter } from "expo-router";
import React from "react";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
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

  const router = useRouter();

  if (recordsContext.isLoading) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.title}>Welcome</Text>

      {recordsContext.isLoaded == true ? (
        <ScrollView style={styles.itemsContainer}>
          {recordsContext.records.map((record) => (
            <View key={record.id}> 
              <ItemCard item={record} />
              <Button
                title="Edit"
                onPress={() => {
                  router.push(`/edit/${record.id}`); // Use absolute path
                }}
              />
            </View>
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

      <CustomButton text={"Manufacturers"} onPress={() => router.push("/list")} />

      <CustomButton
        text={"Analytics"}
        onPress={() => router.push("/analytics")}
      />

      <CustomButton
        text={"Owner"}
        onPress={() => router.navigate("./boss")}
      />
      
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
});
