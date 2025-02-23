import { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Button,
} from "react-native";
import { RecordContext } from "@/contexts/RecordsContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getRecordDetailsFromServer } from "@/repository/NetworkRepository";

export default function Details() {
  const recordsContext = useContext(RecordContext)!;
  const { itemId } = useLocalSearchParams(); // Assume `itemId` is passed as a route parameter
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleDelete = async (itemId: number) => {
    setLoading(true);
    try {
      await recordsContext.deleteRecord(itemId);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        console.log("Loading item details..");
        loadItemDetails();
  }, []);
  
  async function loadItemDetails() {
      try {
          setLoading(true);
          const data = await getRecordDetailsFromServer(parseInt(itemId as string));
          setItem(data);
      } catch (error) {
          console.error('Error loading item details:', error);
      } finally {
          setLoading(false);
      }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!item)
    return (
      <SafeAreaView>
        <Text>Failed to load item</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>
          ID: <Text style={styles.value}>{item.id}</Text>
        </Text>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{item.name}</Text>
        </Text>
        <Text style={styles.label}>
          Supplier: <Text style={styles.value}>{item.supplier}</Text>
        </Text>
        <Text style={styles.label}>
          Details: <Text style={styles.value}>{item.details}</Text>
        </Text>
        <Text style={styles.label}>
          Status: <Text style={styles.value}>{item.status}</Text>
        </Text>
        <Text style={styles.label}>
          Quanitity: <Text style={styles.value}>{item.quantity}</Text>
        </Text>
        <Text style={styles.label}>
          Type: <Text style={styles.value}>{item.type}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  itemContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  value: {
    fontWeight: "normal",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
