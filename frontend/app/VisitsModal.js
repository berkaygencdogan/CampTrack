import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";

export default function VisitModal({
  visible,
  onClose,
  place,
  editVisit,
  onSaved,
}) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const user = useSelector((state) => state.user.userInfo);

  const isEdit = !!editVisit;

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  const [teammates, setTeammates] = useState([user]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [experience, setExperience] = useState("");
  const [photos, setPhotos] = useState([]);

  // ---------------------------------------------------------
  // LOAD EDIT DATA
  // ---------------------------------------------------------
  useEffect(() => {
    if (isEdit && editVisit) {
      setStartDate(new Date(editVisit.startDate));
      setEndDate(new Date(editVisit.endDate));
      setExperience(editVisit.experience || "");

      // teammates => userMap'ten çek
      const mapped = editVisit.teammates.map((id) => ({
        id,
        name: editVisit.userMap[id]?.name || "User",
        image:
          editVisit.userMap[id]?.avatar ||
          `https://ui-avatars.com/api/?name=${
            editVisit.userMap[id]?.name || "U"
          }`,
      }));

      setTeammates(mapped);

      // eski fotoları yükle
      const mappedPhotos =
        editVisit.photos?.map((url) => ({
          uri: url,
          base64: null, // backend’e yeniden göndermek için null
        })) || [];

      setPhotos(mappedPhotos);
    } else {
      setTeammates([user]);
      setPhotos([]);
      setExperience("");
      setSearch("");
    }
  }, [editVisit]);

  // ---------------------------------------------------------
  // USER SEARCH
  // ---------------------------------------------------------
  const searchUser = async (text) => {
    setSearch(text);
    if (text.length < 3) return;

    try {
      const res = await fetch(`${apiUrl}/users/search?username=${text}`);
      const data = await res.json();
      setSearchResults(data.users);
    } catch (e) {
      console.log("Search error:", e);
    }
  };

  // ---------------------------------------------------------
  // PHOTO PICKER
  // ---------------------------------------------------------
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0]]);
    }
  };

  const removeTeammate = (id) => {
    const filtered = teammates.filter((t) => t.id !== id);
    setTeammates(filtered);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------
  // SAVE VISIT (ADD OR UPDATE)
  // ---------------------------------------------------------
  const saveVisit = async () => {
    try {
      const body = {
        visitId: editVisit?.id || null, // edit modunda gerekecek
        placeId: place.id,
        name: place.name, // 🔥 ARTIK DOĞRU
        city: place.city,
        teammates: teammates.map((t) => t.id),
        startDate,
        endDate,
        experience,
        photos: photos.map((p) => p.base64 || p.uri),
      };

      const res = await fetch(`${apiUrl}/visits/addOrUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        onSaved && onSaved();
        onClose();
      }
    } catch (err) {
      console.log("SAVE VISIT ERROR:", err);
    }
  };

  if (!place && !editVisit) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {isEdit ? "Ziyareti Düzenle" : "Yeni Ziyaret"}
        </Text>

        {/* LOCATION INFO */}
        <View style={styles.box}>
          <Text style={styles.label}>Konum</Text>

          <Text style={styles.inputDisabled}>
            {isEdit ? editVisit.placeName : place.name}
          </Text>

          <Text style={styles.city}>
            {isEdit ? editVisit.city : place.city}
          </Text>
        </View>

        {/* TEAMMATES */}
        <Text style={styles.label}>Kimlerle gittin?</Text>

        <View style={styles.row}>
          {teammates.map((t) => (
            <View key={t.id} style={{ position: "relative" }}>
              <Image source={{ uri: t.image }} style={styles.avatar} />

              {/* remove X */}
              {t.id !== user.id && (
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeTeammate(t.id)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* SEARCH */}
        <TextInput
          style={styles.search}
          placeholder="Kullanıcı ara..."
          value={search}
          onChangeText={searchUser}
        />

        {search.length >= 3 && (
          <View style={styles.searchBox}>
            {searchResults.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={styles.userItem}
                onPress={() => {
                  if (!teammates.find((t) => t.id === u.id)) {
                    setTeammates((prev) => [...prev, u]);
                  }
                }}
              >
                <Image source={{ uri: u.image }} style={styles.userImg} />
                <Text style={{ marginLeft: 10 }}>{u.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* DATES */}
        <Text style={styles.label}>Başlangıç Tarihi</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate.toDateString()}</Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="spinner"
            onChange={(_, d) => {
              setShowStartPicker(false);
              if (d) setStartDate(d);
            }}
          />
        )}

        <Text style={styles.label}>Bitiş Tarihi</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endDate.toDateString()}</Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="spinner"
            onChange={(_, d) => {
              setShowEndPicker(false);
              if (d) setEndDate(d);
            }}
          />
        )}

        {/* EXPERIENCE */}
        <Text style={styles.label}>Deneyimlerinizi paylaşın</Text>

        <TextInput
          style={styles.experience}
          placeholder="İstersen bir şeyler yazabilirsin..."
          multiline
          value={experience}
          onChangeText={setExperience}
        />

        {/* PHOTOS */}
        <Text style={styles.label}>Kamp Fotoğrafları</Text>

        <View style={styles.photoRow}>
          {photos.map((p, i) => (
            <View key={i} style={{ position: "relative", marginRight: 8 }}>
              <Image source={{ uri: p.uri }} style={styles.photoPreview} />

              <TouchableOpacity
                style={styles.removePhotoIcon}
                onPress={() => removePhoto(i)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addPhoto} onPress={pickPhoto}>
            <Ionicons name="camera" size={26} color="#7CC540" />
          </TouchableOpacity>
        </View>

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveVisit}>
          <Text style={styles.saveText}>{isEdit ? "Kaydet" : "Ekle"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={{ color: "#666" }}>Kapat</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  inputDisabled: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  city: { marginTop: 5, color: "#777" },

  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 25,
    marginRight: 8,
  },

  removeIcon: {
    position: "absolute",
    right: -4,
    top: -4,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  search: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  searchBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
  },
  userItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  userImg: { width: 36, height: 36, borderRadius: 20 },

  dateBtn: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
  },

  experience: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    minHeight: 80,
  },

  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  photoPreview: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  addPhoto: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#e8f5e2",
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtn: {
    backgroundColor: "#7CC540",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  removePhotoIcon: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  closeBtn: { alignItems: "center", marginTop: 15 },
});
