import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MediaOrderModal({
  visible,
  medias,
  startIndex,
  onClose,
  setMedias,
  onSave,
}) {
  const [orderMap, setOrderMap] = useState({});

  useEffect(() => {
    if (visible) {
      // modal ilk açılınca default sipariş ver
      const obj = {};
      medias.forEach((_, i) => {
        obj[i] = (i + 1).toString();
      });
      setOrderMap(obj);
    }
  }, [visible]);

  // -------------------------------
  // Input değişince kaydet
  // -------------------------------
  const updateValue = (index, value) => {
    // sadece rakam olsun
    const clean = value.replace(/[^0-9]/g, "");

    setOrderMap((prev) => ({
      ...prev,
      [index]: clean,
    }));
  };

  // -------------------------------
  // Save -> doğrulama + sıralama
  // -------------------------------
  const handleSave = () => {
    const count = medias.length;
    const nums = Object.values(orderMap).map((n) => Number(n));

    // boş input var mı?
    if (nums.some((n) => !n)) {
      alert("All numbers must be filled.");
      return;
    }

    // sayı aralığı doğru mu?
    if (nums.some((n) => n < 1 || n > count)) {
      alert(`Numbers must be between 1 and ${count}.`);
      return;
    }

    // duplicate kontrolü
    const unique = new Set(nums);
    if (unique.size !== nums.length) {
      alert("All numbers must be different.");
      return;
    }

    // sıralama
    const newOrder = medias
      .map((m, i) => ({ ...m, rank: Number(orderMap[i]) }))
      .sort((a, b) => a.rank - b.rank)
      .map((m) => ({ url: m.url, type: m.type }));

    setMedias(newOrder);
    onSave();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Reorder Media</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {medias.map((item, index) => (
              <View key={index} style={styles.row}>
                {item.type === "image" ? (
                  <Image source={{ uri: item.url }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, { backgroundColor: "#000" }]}>
                    <Ionicons name="play" color="#fff" size={20} />
                  </View>
                )}

                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={orderMap[index]}
                  onChangeText={(txt) => updateValue(index, txt)}
                  maxLength={2}
                />

                <Text style={styles.rangeText}>/ {medias.length}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 5,
  },

  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  input: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
  },

  rangeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  saveText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
