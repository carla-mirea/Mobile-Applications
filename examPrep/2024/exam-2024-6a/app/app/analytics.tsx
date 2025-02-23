import CustomButton from "@/components/CustomButton";
import { getSupplyTypes, requestSupply } from "@/repository/NetworkRepository";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from "react-native";
import { showMessage } from "react-native-flash-message";

const SupplyManagementScreen = () => {
  const [supplyTypes, setSupplyTypes] = useState<{ type: string; quantity: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSupplyTypes = async () => {
    setIsLoading(true);
    try {
      const supplies = await getSupplyTypes();

      if (supplies.length === 0) {
        showMessage({
          message: "No supply types available!",
          type: "warning",
          duration: 2000,
        });
        setSupplyTypes([]);
        return;
      }

      // Group supplies by type and calculate total quantity
      const groupedSupplies = supplies.reduce((acc: any, supply: any) => {
        if (!acc[supply.type]) {
          acc[supply.type] = { type: supply.type, quantity: 0 };
        }
        acc[supply.type].quantity += supply.quantity;
        return acc;
      }, {});

      setSupplyTypes(Object.values(groupedSupplies));
    } catch (error) {
      showMessage({
        message: "Failed to load supply types!",
        type: "warning",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSupply = async (supplyType: string) => {
    try {
      await requestSupply(supplyType);
      fetchSupplyTypes();
    } catch (error) {
      showMessage({
        message: "Failed to request supply!",
        type: "danger",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    fetchSupplyTypes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : supplyTypes.length > 0 ? (
        <FlatList
          data={supplyTypes}
          keyExtractor={(item) => item.type}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.type} (Total: {item.quantity})</Text>
              <Button title="Request" onPress={() => handleRequestSupply(item.type)} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No supply types found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});

export default SupplyManagementScreen;
