import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const categories = [
  { id: "1", title: "Cars", icon: "car", color: "#FF6B6B", path: "/create-listing/details-form" },
  { id: "2", title: "Motorbikes", icon: "bicycle", color: "#4ECDC4", path: "/create-listing/details-form" },
  { id: "3", title: "Mobile Phones", icon: "phone-portrait", color: "#45B7D1", path: "/create-listing/details-form" },
  { id: "4", title: "Property", icon: "home", color: "#FFBE0B", path: "/create-listing/details-form" },
  { id: "5", title: "Home & Garden", icon: "leaf", color: "#FF9F1C", path: "/create-listing/details-form" },
  { id: "6", title: "Jobs", icon: "briefcase", color: "#8AC926", path: "/create-listing/details-form" },
  { id: "7", title: "Electronics", icon: "laptop", color: "#6A4C93", path: "/create-listing/details-form" },
  { id: "8", title: "Fashion", icon: "shirt", color: "#F25C54", path: "/create-listing/details-form" },
];

export default function PostAdScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const CategoryCard = ({ item, index }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
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
          transform: [{ translateY: slideAnim }, { scale: scaleValue }],
        }}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => router.push(item.path)} // 🔥 Navigate by path
          style={[styles.card, { borderLeftColor: item.color }]}
        >
          <LinearGradient
            colors={["#fff", "#f8f9fa"]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={32} color={item.color} />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6A11CB", "#2575FC"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.welcome}>Welcome Fathima Nifla!</Text>
          <Text style={styles.subtitle}>Choose a category to post your ad</Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item, index }) => <CategoryCard item={item} index={index} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Can't find a category?</Text>
        <TouchableOpacity>
          <Text style={styles.contactSupport}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 10,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    width: (width - 50) / 2,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 4,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  footerText: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 5,
  },
  contactSupport: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A11CB",
  },
});
