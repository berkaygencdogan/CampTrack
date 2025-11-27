import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import itemsData from "../src/assets/items.json";
import { useDispatch, useSelector } from "react-redux";
import { syncAddItem } from "../api/backpackApi";
import i18n from "./language/index";

export default function AddItemsModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  const [selected, setSelected] = useState([]);

  const toggleSelect = (item) => {
    if (selected.some((x) => x.id === item.id)) {
      setSelected(selected.filter((x) => x.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const confirmAdd = () => {
    selected.forEach(
      (item) => dispatch(syncAddItem(user.id, item)) // backend + redux
    );

    setSelected([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t("addItems")}</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>{i18n.t("close")}</Text>
        </TouchableOpacity>

        <FlatList
          data={itemsData}
          keyExtractor={(item) => item.id.toString()}
          removeClippedSubviews={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          renderItem={({ item }) => {
            const isSelected = selected.some((x) => x.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.itemRow, isSelected && styles.selected]}
                onPress={() => toggleSelect(item)}
              >
                <Image
                  source={{ uri: item.img }}
                  style={styles.img}
                  cachePolicy="disk"
                  transition={200}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{i18n.t(item.name)}</Text>
                  <Text style={styles.category}>{i18n.t(item.category)}</Text>
                </View>

                {isSelected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={confirmAdd}>
          <Text style={styles.saveText}>{i18n.t("addselected")}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginBottom: 12,
  },
  selected: {
    borderColor: "#7CC540",
    borderWidth: 2,
  },
  img: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  name: { fontSize: 17, fontWeight: "600" },
  category: { color: "#777", fontSize: 13 },

  check: {
    fontSize: 24,
    color: "#7CC540",
    fontWeight: "bold",
  },

  saveBtn: {
    backgroundColor: "#7CC540",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 40,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  closeBtn: { position: "absolute", right: 40, top: 50 },
  closeText: { fontSize: 16, color: "red" },
});
