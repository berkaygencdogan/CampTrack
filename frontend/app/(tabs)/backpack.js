import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import AddItemsModal from "../AddItemsModal";
import BackPackItem from "../BackPackItem";
import { syncFetchBackpack } from "../../api/backpackApi";
import I18n from "../language/index";

export default function Backpack() {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncFetchBackpack(user.id));
  }, []);

  const items = useSelector((state) => state.backpack.items);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t("mybackpack")}</Text>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>{I18n.t("nobackpackitem")}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BackPackItem item={item} />}
        />
      )}

      {/* + BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AddItemsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: { fontSize: 17, color: "#777" },

  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 65,
    height: 65,
    backgroundColor: "#7CC540",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
