import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable, Button, Alert } from "react-native";

type ItemCardProps = {
  item: Item;
};

const ItemCard = ({ item }: ItemCardProps) => {
  const router = useRouter();

  return (
    <>
      <Pressable
        onPress={() => {
          router.push(`./details/${item.id}`);
        } }
      >
        <View style={styles.card}>
          <Text style={styles.text}>ID: {item.id}</Text>
          <Text style={styles.text}>Model: {item.model}</Text>
          <Text style={styles.text}>Owner: {item.status}</Text>
          <Text style={styles.text}>Status: {item.manufacturer}</Text>
        </View>
      </Pressable>
      
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
  },
});

export default ItemCard;
