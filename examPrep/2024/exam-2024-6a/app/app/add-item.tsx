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
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const recordsContext = useContext(RecordContext)!;
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !supplier || !details || !status || !quantity || !type) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const newItem: Item = {
      id: -1, // Temporary ID, will be replaced by the backend or context
      name: name,
      supplier: supplier,
      details: details,
      status: status,
      quantity: parseInt(quantity, 10), // Convert string to number
      type: type,
    };

    if (isNaN(newItem.quantity)) {
      Alert.alert("Quantity must be a valid number");
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Team"
        value={supplier}
        onChangeText={setSupplier}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
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
        placeholder="Members (numeric)"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={type}
        onChangeText={setType}
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
