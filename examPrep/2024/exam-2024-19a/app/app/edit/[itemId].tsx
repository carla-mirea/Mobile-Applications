import { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { RecordContext } from "@/contexts/RecordsContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateVehicle } from "@/repository/NetworkRepository";

export default function UpdateItemScreen() {
  const { itemId } = useLocalSearchParams(); // Get item ID from route params
  const parsedId = parseInt(itemId as string, 10);

  const recordsContext = useContext(RecordContext)!;
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  const [model, setModel] = useState("");
  const [status, setStatus] = useState("");
  const [capacity, setCapacity] = useState("");
  const [owner, setOwner] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!parsedId || isNaN(parsedId)) {
        Alert.alert("Invalid ID!");
        router.replace("/");
        return;
      }

      setLoading(true);
      try {
        const result = await recordsContext.getRecordDetails!(parsedId);
        if (!result) {
          Alert.alert("Item not found!");
          router.replace("/");
          return;
        }
        setItem(result);
        setModel(result.model);
        setStatus(result.status);
        setCapacity(result.capacity.toString());
        setOwner(result.owner);
        setManufacturer(result.manufacturer);
        setCargo(result.cargo.toString());
      } catch (error) {
        Alert.alert("Failed to fetch item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [parsedId]);

  const handleSubmit = async () => {
    if (!model || !status || !capacity || !owner || !manufacturer || !cargo) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const updatedItem: Item = {
      id: parsedId,
      model,
      status,
      capacity: parseInt(capacity, 10),
      owner,
      manufacturer,
      cargo: parseInt(cargo, 10),
    };

    if (isNaN(updatedItem.capacity) || isNaN(updatedItem.cargo)) {
      Alert.alert("Capacity and Cargo must be valid numbers");
      return;
    }

    setLoading(true);
    try {
      await updateVehicle(updatedItem);
      Alert.alert("Item updated successfully!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Failed to update the item!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Item not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Model"
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacity"
        value={capacity}
        keyboardType="numeric"
        onChangeText={setCapacity}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner"
        value={owner}
        onChangeText={setOwner}
      />
      <TextInput
        style={styles.input}
        placeholder="Manufacturer"
        value={manufacturer}
        onChangeText={setManufacturer}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        keyboardType="numeric"
        onChangeText={setCargo}
      />

      <Button title="Update Item" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
