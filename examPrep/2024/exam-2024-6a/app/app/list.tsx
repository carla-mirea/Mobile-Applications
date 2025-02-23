import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { RecordContext } from '@/contexts/RecordsContext';
import ItemCard from '@/components/ItemCard';
import { getSupplyOrders } from '@/repository/NetworkRepository';

const ListScreen = () => {
    const [orders, setOrders] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const recordsContext = useContext(RecordContext)!;

    useEffect(() => {
      console.log("OrdersScreen mounted");
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            setLoading(true);
            const data = await getSupplyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <ActivityIndicator />;

    return (
      <View style={styles.container}>
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <View style={styles.orderContainer}>
              <ItemCard item={item} />
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
  orderContainer: {
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
