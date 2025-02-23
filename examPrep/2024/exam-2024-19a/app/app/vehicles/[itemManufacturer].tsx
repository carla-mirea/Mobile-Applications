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
import { getVehiclesByType } from "@/repository/NetworkRepository";
import ItemCard from "@/components/ItemCard";

export default function Vehicles() {
  const { itemManufacturer } = useLocalSearchParams(); // Assume `itemType` is passed as a route parameter
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (itemManufacturer) {
      const result = await getVehiclesByType(itemManufacturer as string);

      setItems(result);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, [itemManufacturer]);

  if (loading) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!items)
    return (
      <SafeAreaView>
        <Text>Failed to load items</Text>
      </SafeAreaView>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.listContainer}>
            <ItemCard item={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  listContainer: {
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
});
