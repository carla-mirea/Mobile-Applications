import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getAllItemsFromServer } from "@/repository/NetworkRepository";
import { showMessage } from "react-native-flash-message";
import React from "react";

// Define types
interface Vehicle {
  id: number;
  model: string;
  status: string;
  capacity: number;
  owner: string;
}

interface OwnerStats {
  name: string;
  vehicleCount: number;
}

const AnalyticsScreen = () => {
  const [topVehicles, setTopVehicles] = useState<Vehicle[]>([]);
  const [topOwners, setTopOwners] = useState<OwnerStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data: Vehicle[] = await getAllItemsFromServer();
      if (!Array.isArray(data) || data.length === 0) {
        showMessage({ message: "No data available!", type: "warning", duration: 2000 });
        return;
      }

      // Get top 10 vehicles by capacity (descending)
      const sortedVehicles = [...data]
        .sort((a, b) => b.capacity - a.capacity)
        .slice(0, 10);
      setTopVehicles(sortedVehicles);

      // Aggregate owner vehicle counts
      const ownerMap: Record<string, number> = {};
      data.forEach((vehicle) => {
        ownerMap[vehicle.owner] = (ownerMap[vehicle.owner] || 0) + 1;
      });

      // Get top 5 owners by vehicle count (descending)
      const sortedOwners = Object.entries(ownerMap)
        .map(([name, vehicleCount]) => ({ name, vehicleCount }))
        .sort((a, b) => b.vehicleCount - a.vehicleCount)
        .slice(0, 5);
      setTopOwners(sortedOwners);
    } catch (error) {
      showMessage({ message: "Failed to load analytics!", type: "danger", duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          {/* Top 10 Vehicles */}
          <Text style={styles.header}>Top 10 Vehicles</Text>
          <FlatList
            data={topVehicles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.itemText}>{item.model} ({item.status})</Text>
                <Text style={styles.subText}>Capacity: {item.capacity} | Owner: {item.owner}</Text>
              </View>
            )}
          />

          {/* Top 5 Owners */}
          <Text style={styles.header}>Top 5 Owners</Text>
          <FlatList
            data={topOwners}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.subText}>Vehicles: {item.vehicleCount}</Text>
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#555",
  },
});

export default AnalyticsScreen;
