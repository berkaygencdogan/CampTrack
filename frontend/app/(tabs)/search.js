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
  const [searchMode, setSearchMode] = useState("place");

  // FETCH POPULAR
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

  // SEARCH
  const handleSearch = async (text) => {
    setSearchTerm(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const url =
        searchMode === "place"
          ? `${process.env.EXPO_PUBLIC_API_URL}/places/search?query=${text}`
          : `${process.env.EXPO_PUBLIC_API_URL}/users/search?username=${text}`;

      const res = await fetch(url);
      const data = await res.json();

      setResults(searchMode === "place" ? data.places || [] : data.users || []);
    } catch (err) {
      console.log("Search API error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={20} color="#bbb" />
        <TextInput
          style={styles.searchInput}
          placeholder={
            searchMode === "place" ? i18n.t("searchcamp") : "Search users..."
          }
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      {/* CATEGORY CHIPS */}
      <View style={styles.categoryRow}>
        <TouchableOpacity
          onPress={() => {
            setSearchMode("place");
            setSearchTerm("");
            setResults([]);
          }}
          style={[
            styles.categoryChip,
            searchMode === "place" && styles.categoryChipActive,
          ]}
        >
          <Ionicons
            name="location-outline"
            size={16}
            color={searchMode === "place" ? "#fff" : "#ccc"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.categoryText,
              searchMode === "place" && styles.categoryTextActive,
            ]}
          >
            Place
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSearchMode("user");
            setSearchTerm("");
            setResults([]);
          }}
          style={[
            styles.categoryChip,
            searchMode === "user" && styles.categoryChipActive,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={searchMode === "user" ? "#fff" : "#ccc"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.categoryText,
              searchMode === "user" && styles.categoryTextActive,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 15 }}
      >
        {/* NO SEARCH → POPULAR */}
        {searchTerm.trim() === "" ? (
          searchMode === "place" ? (
            <View>
              <Text style={styles.sectionTitle}>{i18n.t("populerplaces")}</Text>

              {popular.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(`/LocationDetail?id=${item.id}`)}
                >
                  <View style={styles.card}>
                    <Image
                      source={{ uri: item.photos?.[0] }}
                      style={styles.cardImage}
                    />

                    <View style={styles.cardOverlay}>
                      <Text style={styles.cardTitle}>{item.name}</Text>

                      <Text style={styles.cardDesc}>
                        {item.description?.slice(0, 80)}...
                      </Text>

                      <View style={styles.cardBottomRow}>
                        <View style={styles.bottomLeft}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#fff"
                          />
                          <Text style={styles.cardBottomText}>{item.city}</Text>
                        </View>

                        <View style={styles.bottomRight}>
                          <Ionicons name="star" size={14} color="#ffcc33" />
                          <Text style={styles.cardBottomText}>
                            {item.rating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ color: "#777" }}>Kullanıcı aramak için yaz...</Text>
          )
        ) : (
          /* SEARCH RESULTS */
          <View>
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
                    router.push(`/profile/${item.id}`);
                  } else {
                    router.push(`/LocationDetail?id=${item.id}`);
                  }
                }}
              >
                <View style={styles.card}>
                  <Image
                    source={{
                      uri:
                        searchMode === "place"
                          ? item.photos?.[0]
                          : item.avatar ||
                            item.image ||
                            "https://i.imgur.com/0y8Ftya.png",
                    }}
                    style={styles.cardImage}
                  />

                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardTitle}>{item.name}</Text>

                    <Text style={styles.cardDesc}>
                      {searchMode === "place"
                        ? item.description?.slice(0, 80)
                        : item.bio}
                    </Text>

                    <View style={styles.cardBottomRow}>
                      <View style={styles.bottomLeft}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color="#fff"
                        />
                        <Text style={styles.cardBottomText}>
                          {searchMode === "place"
                            ? item.city
                            : "@" + item.nickname}
                        </Text>
                      </View>

                      <View style={styles.bottomRight}>
                        {searchMode === "place" && (
                          <>
                            <Ionicons name="star" size={14} color="#ffcc33" />
                            <Text style={styles.cardBottomText}>
                              {item.rating}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  /* SEARCH BAR */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },

  /* CATEGORY TABS */
  categoryRow: {
    flexDirection: "row",
    marginTop: 18,
    marginBottom: 10,
  },

  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },

  categoryChipActive: {
    backgroundColor: "#7CC540",
    borderColor: "#7CC540",
  },

  categoryText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },

  /* TITLES */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#333",
  },

  /* CARD (LIGHT PREMIUM STYLE) */
  card: {
    width: "100%",
    height: 240,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  cardOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  cardDesc: {
    fontSize: 14,
    color: "#EEE",
    marginTop: 4,
  },

  /* CARD BOTTOM ROW */
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardBottomText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 13,
  },
});
