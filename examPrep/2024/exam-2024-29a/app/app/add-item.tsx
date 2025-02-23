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
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reserved, setReserved] = useState("");

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const recordsContext = useContext(RecordContext)!;
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !author || !genre || !quantity || !reserved) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const newItem: Item = {
      id: -1, // Temporary ID, will be replaced by the backend or context
      title: title,
      author: author,
      genre: genre,
      quantity: parseInt(quantity, 10), // Convert string to number
      reserved: parseInt(reserved, 10),
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
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity (numeric)"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Reserved (numeric)"
        value={reserved}
        keyboardType="numeric"
        onChangeText={setReserved}
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
