import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { db } from "../../src/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Search() {
  const router = useRouter();

  const [popular, setPopular] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // -------------------------------------
  // Popüler yerleri çek
  // -------------------------------------
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const q = query(
          collection(db, "places"),
          where("isPopular", "==", true)
        );
        const snap = await getDocs(q);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPopular(list);
      } catch (err) {
        console.log("Error fetching popular:", err);
      }
    };

    fetchPopular();
  }, []);

  // -------------------------------------
  // Arama (searchKeywords)
  // -------------------------------------
  const handleSearch = async (text) => {
    setSearchTerm(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const lower = text.toLowerCase();

    try {
      const q = query(
        collection(db, "places"),
        where("searchKeywords", "array-contains", lower)
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(list);
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search camp places..."
          placeholderTextColor="#999"
          onChangeText={handleSearch}
          value={searchTerm}
        />
        <Ionicons name="search-outline" size={22} color="#7CC540" />
      </View>

      {/* POPULAR LIST */}
      {searchTerm.trim() === "" ? (
        <View>
          <Text style={styles.sectionTitle}>Popular Camps</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {popular.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/location/${item.id}`)}
              >
                <View style={styles.popularCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.popularImage}
                  />
                  <Text style={styles.popularName}>{item.name}</Text>
                  <Text style={styles.popularCity}>{item.city}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        // SEARCH RESULTS
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Search Results</Text>

          {results.length === 0 && (
            <Text style={{ marginTop: 15, color: "#777" }}>
              No results found.
            </Text>
          )}

          {results.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/location/${item.id}`)}
            >
              <View style={styles.resultRow}>
                <Image source={{ uri: item.image }} style={styles.resultImg} />
                <View>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultCity}>{item.city}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/* -------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
  },
  popularCard: {
    width: 160,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    marginRight: 15,
    paddingBottom: 12,
  },
  popularImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  popularName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 10,
  },
  popularCity: {
    color: "#777",
    marginLeft: 10,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    padding: 10,
    marginTop: 15,
  },
  resultImg: {
    width: 55,
    height: 55,
    borderRadius: 12,
    marginRight: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultCity: {
    color: "#777",
    fontSize: 14,
  },
});
