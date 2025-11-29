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
  const [searchMode, setSearchMode] = useState("place"); // "place" | "user"

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
      let url = "";

      if (searchMode === "place") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/places/search?query=${text}`;
      } else {
        url = `${process.env.EXPO_PUBLIC_API_URL}/users/search?username=${text}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (searchMode === "place") {
        setResults(data.places || []);
      } else {
        setResults(data.users || []);
      }
    } catch (err) {
      console.log("Search API error:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* SEARCH MODE SWITCH */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          onPress={() => setSearchMode("place")}
          style={[
            styles.modeBtn,
            {
              backgroundColor: searchMode === "place" ? "#7CC540" : "#EDEDED",
            },
          ]}
        >
          <Text
            style={{
              color: searchMode === "place" ? "#fff" : "#333",
              fontWeight: "600",
            }}
          >
            Place
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSearchMode("user")}
          style={[
            styles.modeBtn,
            {
              backgroundColor: searchMode === "user" ? "#7CC540" : "#EDEDED",
            },
          ]}
        >
          <Text
            style={{
              color: searchMode === "user" ? "#fff" : "#333",
              fontWeight: "600",
            }}
          >
            User
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={
            searchMode === "place" ? i18n.t("searchcamp") : "Search users..."
          }
          placeholderTextColor="#999"
          onChangeText={handleSearch}
          value={searchTerm}
        />
        <Ionicons name="search-outline" size={22} color="#7CC540" />
      </View>

      {/* POPULAR OR SEARCH RESULTS */}
      {searchTerm.trim() === "" ? (
        searchMode === "place" ? (
          // -------------------------------------
          // POPULAR PLACES (ONLY PLACE MODE)
          // -------------------------------------
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
          // -------------------------------------
          // USER MODE → boşken popüler gösterme
          // -------------------------------------
          <Text style={{ marginTop: 20, color: "#777" }}>
            Kullanıcı aramak için bir şey yazın...
          </Text>
        )
      ) : (
        // -------------------------------------
        // SEARCH RESULTS (PLACE OR USER)
        // -------------------------------------
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
              onPress={() => {
                if (searchMode === "user") {
                  router.push(`/UserProfile?id=${item.id}`);
                } else {
                  router.push(`/LocationDetail?id=${item.id}`);
                }
              }}
            >
              <View style={styles.resultRow}>
                <Image
                  source={{
                    uri:
                      searchMode === "place"
                        ? item.photos?.[0]
                        : item.avatar ||
                          item.image ||
                          "https://i.imgur.com/0y8Ftya.png",
                  }}
                  style={styles.resultImg}
                />
                <View>
                  <Text style={styles.resultName}>
                    {searchMode === "place" ? item.name : item.name}
                  </Text>
                  <Text style={styles.resultCity}>
                    {searchMode === "place" ? item.city : ""}
                  </Text>
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

  modeRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
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
