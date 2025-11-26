import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import I18n from "../language/index";

export default function Layout() {
  const unreadCount = useSelector((state) => state.user.notificationCount);

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
          title: `${I18n.t("home")}`,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: `${I18n.t("search")}`,
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="backpack"
        options={{
          title: `${I18n.t("backpack")}`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="backpack" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="teammates"
        options={{
          title: `${I18n.t("teammates")}`,
          tabBarIcon: ({ color }) => (
            <AntDesign name="team" size={26} color={color} />
          ),
        }}
      />

      {/* 🔥 Profil + Badge */}
      <Tabs.Screen
        name="profile"
        options={{
          title: `${I18n.t("profile")}`,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
