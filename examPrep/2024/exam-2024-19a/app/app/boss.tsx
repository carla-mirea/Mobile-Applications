import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { getOwnerVehicles } from "@/repository/NetworkRepository";
import { RecordContext } from "@/contexts/RecordsContext";

export default function BossScreen() {
  const [owner, setOwner] = useState<string>("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const recordsContext = useContext(RecordContext)!;

  useEffect(() => {
    loadOwner();
  }, []);

  const loadOwner = async () => {
    const storedOwner = await recordsContext.getOwnerDb();

    if (storedOwner) {
      setOwner(storedOwner);
      fetchVehicles(storedOwner);
    }
  };

  const saveOwner = async () => {
    if (owner.trim() === "") return;

    await recordsContext.addOwnerToDb(owner);
    fetchVehicles(owner);
  };

  const fetchVehicles = async (ownerName: string) => {
    setLoading(true);
    try {
      const response = await getOwnerVehicles(ownerName);
      setVehicles(response);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Owner Information</Text>
      <TextInput style={styles.input} placeholder="Enter your name" value={owner} onChangeText={setOwner} />
      <CustomButton text="Save Name" onPress={saveOwner} />

      {loading ? <ActivityIndicator size="large" /> : (
        <>
          <Text style={styles.subtitle}>Your Vehicles:</Text>
          {vehicles.length === 0 ? <Text>No vehicles found. Last Owner: {owner}</Text> : (
            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.vehicleItem}>
                  <Text style={styles.vehicleText}>{item.model} - {item.status} - Capacity: {item.capacity}</Text>
                </View>
              )}
            />
          )}
        </>
      )}

      <CustomButton text="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", marginTop: 200 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  vehicleItem: { padding: 10, marginVertical: 5, backgroundColor: "#f0f0f0", borderRadius: 5 },
  vehicleText: { fontSize: 16 },
});
