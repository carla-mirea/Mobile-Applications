import CustomButton from "@/components/CustomButton";
import { RecordContext } from "@/contexts/RecordsContext";
import { getAllItemsFromServer } from "@/repository/NetworkRepository";
import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { showMessage } from "react-native-flash-message";

type Project = {
  id: number;
  name: string;
  status: string;
  members: number;
};

const AnalyticsScreen = () => {
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTopProjects = async () => {
    setIsLoading(true);
    try {
      const projects: Project[] = await getAllItemsFromServer();

      if (projects.length === 0) {
        showMessage({
          message: "No projects available!",
          type: "warning",
          duration: 2000,
        });
        setTopProjects([]);
        return;
      }

      // Sort by ascending status and descending number of members
      const sortedProjects = projects
        .sort((a, b) => {
          if (a.status < b.status) return -1;
          if (a.status > b.status) return 1;
          return b.members - a.members;
        })
        .slice(0, 5); // Get the top 5

      setTopProjects(sortedProjects);
    } catch (error) {
      showMessage({
        message: "Failed to load projects!",
        type: "warning",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProjects();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : topProjects.length > 0 ? (
        <FlatList
          data={topProjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 8,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Text style={{ fontSize: 16 }}>{item.name} ({item.status})</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.members} members</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", fontSize: 18, marginTop: 20 }}>
          No projects found.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default AnalyticsScreen;