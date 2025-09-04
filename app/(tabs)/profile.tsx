import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");


const options = [
  { id: "6", title: "My Profile", icon: "person", color: "#6A11CB", path: "/settings/update" },
  { id: "1", title: "My Ads", icon: "pricetags", color: "#FF6B6B", path: "/my-ads" },
  { id: "2", title: "My Membership", icon: "card", color: "#4ECDC4", path: "/membership" },
  { id: "3", title: "Favorites", icon: "star", color: "#FFBE0B", path: "/favorites" },
  { id: "4", title: "Saved Searches", icon: "bookmark", color: "#45B7D1", path: "/saved-searches" },
  { id: "5", title: "Phone Numbers", icon: "call", color: "#8AC926", path: "/phone-numbers" },
  { id: "7", title: "Stay Safe", icon: "shield", color: "#FF9F1C", path: "/safety" },
  { id: "8", title: "FAQ", icon: "help-circle", color: "#6A4C93", path: "/faq" },
  { id: "9", title: "How to Sell Fast?", icon: "flash", color: "#F25C54", path: "/sell-fast" },
];


const OptionItem = ({ item, index, fadeAnim, slideAnim, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 10 - index * 2],
            }),
          },
          { scale: scaleValue },
        ],
      }}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.optionCard}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={styles.optionText}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6A11CB", "#2575FC"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.userName}>Fathima Nifla</Text>
          <Text style={styles.userEmail}>nifla2002@gmail.com</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Ads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {options.map((item, index) => (
            <OptionItem
              key={item.id}
              item={item}
              index={index}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
              onPress={() => router.push(item.path)}
            />
          ))}

          {/* Logout */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 10],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={[styles.optionCard, styles.logoutCard]}
              onPress={() => router.push("auth/login")}
            >
              <View style={[styles.iconContainer, { backgroundColor: "#FED7D7" }]}>
                <Ionicons name="log-out" size={22} color="#E53E3E" />
              </View>
              <Text style={[styles.optionText, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Version */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 10],
                  }),
                },
              ],
            }}
          >
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}></Text>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileHeader: { alignItems: "center" },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#48BB78",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 5 },
  userEmail: { fontSize: 14, color: "rgba(255, 255, 255, 0.9)", marginBottom: 20 },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 15,
    width: "80%",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "rgba(255, 255, 255, 0.9)" },
  statDivider: { width: 1, backgroundColor: "rgba(255, 255, 255, 0.3)", marginHorizontal: 10 },
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 25 },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 30 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  logoutCard: { borderLeftWidth: 4, borderLeftColor: "#E53E3E", marginTop: 10 },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#2D3748" },
  logoutText: { color: "#E53E3E" },
  versionContainer: { alignItems: "center", marginTop: 15, marginBottom: 30 },
  versionText: { fontSize: 12, color: "#A0AEC0" },
  bottomSpacer: { height: 80 },
});
