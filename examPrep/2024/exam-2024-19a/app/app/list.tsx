import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  fetchManufacturers,
} from "@/repository/NetworkRepository";
import { RecordContext } from "@/contexts/RecordsContext";
import ItemCard from "@/components/ItemCard";
import { useRouter } from "expo-router";

const ListScreen = () => {
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log("ListScreen mounted");
    loadManufacturers();
  }, []);

  async function loadManufacturers() {
    try {
      setLoading(true);
      const data = await fetchManufacturers();
      setManufacturers(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        data={manufacturers}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text}>{item}</Text>
            <Button
              title="View Vehicles"
              onPress={() => {
                router.push(`./vehicles/${item}`);
              }}
            />
          </View>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  text: {
    padding: 8,
    backgroundColor: "#5dade2",
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
});

export default ListScreen;
