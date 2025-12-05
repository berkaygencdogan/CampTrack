// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import I18n from "../language/index";

export default function Layout() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.userInfo);
  const unreadCount = useSelector((state) => state.user.notificationCount);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/notifications/${user.id}`
        );

        if (res.data.success) {
          const list = res.data.notifications;

          dispatch({
            type: "user/setNotificationCount",
            payload: list.length,
          });

          dispatch({
            type: "notifications/setItems",
            payload: list,
          });
        }
      } catch (err) {
        console.log("NOTIF CHECK ERROR:", err.message);
      }
    }, 5000); // 5 saniyede bir

    return () => clearInterval(interval);
  }, [user]);

  // --------------------------------------------------------
  // Profile tab icon + badge
  // --------------------------------------------------------
  const ProfileIcon = ({ color }) => (
    <View style={{ width: 28, height: 28 }}>
      <Ionicons name="person-outline" size={26} color={color} />

      {unreadCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -4,
            backgroundColor: "red",
            borderRadius: 10,
            paddingHorizontal: 4,
            minWidth: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "700",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          backgroundColor: "#84CC16",
          borderTopColor: "#fff",
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: I18n.t("home"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: I18n.t("search"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="backpack"
        options={{
          title: I18n.t("backpack"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="backpack" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="teammates"
        options={{
          title: I18n.t("teammates"),
          tabBarIcon: ({ color }) => (
            <AntDesign name="team" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: I18n.t("profile"),
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
