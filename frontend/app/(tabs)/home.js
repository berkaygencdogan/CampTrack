import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PlaceCard from "../PlaceCard";
import i18n from "../language/index";

export default function Home() {
  const router = useRouter();

  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [allLoading, setAllLoading] = useState(true);

  const API = process.env.EXPO_PUBLIC_API_URL;
  const fetchPopular = async () => {
    try {
      const res = await fetch(`${API}/places/popular`);
      const data = await res.json();
      setPopular(data.places || []);
    } catch (err) {
      console.log("Popular Fetch Err:", err);
    } finally {
      setPopularLoading(false);
    }
  };

  // -----------------------------------------------------------
  // FETCH NEW PLACES
  // -----------------------------------------------------------
  const fetchNew = async () => {
    try {
      const res = await fetch(`${API}/places/new`);
      const data = await res.json();
      setRecent(data.places || []);
    } catch (err) {
      console.log("New Fetch Err:", err);
    } finally {
      setRecentLoading(false);
    }
  };

  // -----------------------------------------------------------
  // FETCH ALL PLACES
  // -----------------------------------------------------------
  const fetchAll = async () => {
    try {
      const res = await fetch(`${API}/places`);
      const data = await res.json();
      setAllPlaces(data.places || []);
    } catch (err) {
      console.log("All Fetch Err:", err);
    } finally {
      setAllLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPopularLoading(true);
      setRecentLoading(true);
      setAllLoading(true);

      fetchPopular();
      fetchNew();
      fetchAll();
    }, [])
  );

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* POPULAR */}
        <Text style={styles.sectionTitle}>⭐ {i18n.t("populerplaces")}</Text>

        {popularLoading ? (
          <ActivityIndicator
            size="large"
            color="#7CC540"
            style={{ marginTop: 10 }}
          />
        ) : (
          <FlatList
            data={popular}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PlaceCard item={item} small />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15 }}
          />
        )}

        {/* NEW */}
        <Text style={styles.sectionTitle}>🔥 {i18n.t("newaddedplaces")}</Text>

        {recentLoading ? (
          <ActivityIndicator
            size="large"
            color="#7CC540"
            style={{ marginTop: 10 }}
          />
        ) : (
          <FlatList
            data={recent}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PlaceCard item={item} small />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15 }}
          />
        )}

        {/* ALL PLACES */}
        <Text style={styles.sectionTitle}>📍 {i18n.t("allplaces")}</Text>

        <View style={{ paddingHorizontal: 15 }}>
          {allLoading ? (
            <ActivityIndicator
              size="large"
              color="#7CC540"
              style={{ marginTop: 10 }}
            />
          ) : (
            allPlaces.map((item) => <PlaceCard key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("../AddPlaceScreen")}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 10,
  },
  addBtn: {
    position: "absolute",
    right: 25,
    bottom: 35,
    backgroundColor: "#7CC540",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 50,
    elevation: 5,
  },
  plus: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "900",
    marginTop: -4,
  },
});
