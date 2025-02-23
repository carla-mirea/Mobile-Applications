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
  const [team, setTeam] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [members, setMembers] = useState("");
  const [type, setType] = useState("");

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const recordsContext = useContext(RecordContext)!;
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !team || !details || !status || !members || !type) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const newItem: Item = {
      id: -1, // Temporary ID, will be replaced by the backend or context
      name: name,
      team: team,
      details: details,
      status: status,
      members: parseInt(members, 10), // Convert string to number
      type: type,
    };

    if (isNaN(newItem.members)) {
      Alert.alert("Members must be a valid number");
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
        value={team}
        onChangeText={setTeam}
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
        value={members}
        keyboardType="numeric"
        onChangeText={setMembers}
        placeholderTextColor={"grey"}
      />
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={members}
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
