import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { RecordContext } from "@/contexts/RecordsContext";

const AddItemScreen = () => {
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("");
  const [capacity, setCapacity] = useState("");
  const [owner, setOwner] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [cargo, setCargo] = useState("");

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const recordsContext = useContext(RecordContext)!;
  const router = useRouter();

  const handleSubmit = async () => {
    if (!model || !capacity || !owner || !status || !manufacturer || !cargo) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const newItem: Item = {
      id: -1, // Temporary ID, will be replaced by the backend or context
      model: model,
      status: status,
      capacity: parseInt(capacity, 10),
      owner: owner,
      manufacturer: manufacturer, // Convert string to number
      cargo: parseInt(cargo, 10),
    };

    if (isNaN(newItem.capacity)) {
      Alert.alert("Capacity must be a valid number");
      return;
    }

    setShowLoading(true);
    try {
      await recordsContext.addRecord(newItem); // Ensure your context handles `Item` type
      Alert.alert("Item added successfully!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Failed to add the item!");
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacity (numeric)"
        value={capacity}
        keyboardType="numeric"
        onChangeText={setCapacity}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner"
        value={owner}
        onChangeText={setOwner}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Manufacturer"
        value={manufacturer}
        onChangeText={setManufacturer}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo (numeric)"
        value={cargo}
        keyboardType="numeric"
        onChangeText={setCargo}
        placeholderTextColor={"grey"}
      />

      <Button title="Add Item" onPress={handleSubmit} />

      {showLoading && <ActivityIndicator size="large" />}
    </View>
  );
};

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
});

export default AddItemScreen;
