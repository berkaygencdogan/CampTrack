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
import i18n from "../language/index";

export default function Search() {
  const router = useRouter();

  const [popular, setPopular] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // -------------------------------------
  // POPULAR
  // -------------------------------------
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/places/popular`
        );
        const data = await res.json();

        if (res.ok) setPopular(data.places || []);
      } catch (err) {
        console.log("Popular fetch error:", err);
      }
    };

    fetchPopular();
  }, []);

  // -------------------------------------
  // SEARCH
  // -------------------------------------
  const handleSearch = async (text) => {
    setSearchTerm(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/places/search?query=${text}`
      );

      const data = await res.json();

      if (res.ok) setResults(data.places || []);
    } catch (err) {
      console.log("Search API error:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t("searchcamp")}
          placeholderTextColor="#999"
          onChangeText={handleSearch}
          value={searchTerm}
        />
        <Ionicons name="search-outline" size={22} color="#7CC540" />
      </View>

      {/* POPULAR OR SEARCH RESULTS */}
      {searchTerm.trim() === "" ? (
        <View>
          <Text style={styles.sectionTitle}>{i18n.t("populerplaces")}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {popular.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/LocationDetail?id=${item.id}`)}
              >
                <View style={styles.popularCard}>
                  <Image
                    source={{ uri: item.photos?.[0] }}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>{i18n.t("searchresult")}</Text>

          {results.length === 0 && (
            <Text style={{ marginTop: 15, color: "#777" }}>
              {i18n.t("noresult")}
            </Text>
          )}

          {results.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/LocationDetail?id=${item.id}`)}
            >
              <View style={styles.resultRow}>
                <Image
                  source={{ uri: item.photos?.[0] }}
                  style={styles.resultImg}
                />
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
