import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchInProgressProjects, enrollInProject } from "@/repository/NetworkRepository";
import { RecordContext } from '@/contexts/RecordsContext';
import ItemCard from '@/components/ItemCard';

const ListScreen = () => {
    const [projects, setProjects] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const recordsContext = useContext(RecordContext)!;

    useEffect(() => {
      console.log("ListScreen mounted");
        loadProjects();
    }, []);

    async function loadProjects() {
        try {
            setLoading(true);
            const data = await fetchInProgressProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleEnroll(item: Item) {
      setLoading(true);
        try {
            await enrollInProject(item.id); // Assuming the update request enrolls the user
            recordsContext.updateRecord(item);
            loadProjects(); // Refresh the list
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
          setLoading(false);
        }
    }

    if (loading) return <ActivityIndicator />;

    return (
      <View style={styles.container}>
        <FlatList
          data={projects}
          renderItem={({ item }) => (
            <View style={styles.projectContainer}>
              <ItemCard item={item} />
              <Button title="Enroll" onPress={() => handleEnroll(item)} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
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
  projectContainer: {
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


export default ListScreen;
