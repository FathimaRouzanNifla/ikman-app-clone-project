import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Text,
  StatusBar,
  Platform,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import CategoryCard from "../../components/CategoryCard";
import { CATEGORIES } from "../../data/dummyData";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Filter categories based on search
  const filteredCategories = CATEGORIES.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Animate components on mount
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

  const handleSearchFocus = () => {
    Animated.spring(scaleValue, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6A11CB"
        translucent={false}
      />

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.header}>Discover</Text>
          <Text style={styles.subHeader}>
            Find amazing products & services
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {/* 🔎 Animated Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Categories Header */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Popular Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item, index }) => (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 20 - index * 5],
                      }),
                    },
                  ],
                }}
              >
                <CategoryCard
                  title={item.title}
                  icon={item.icon}
                  color={item.color}
                  onPress={() => router.push(`/listings/${item.id}`)}
                />
              </Animated.View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={60} color="#ddd" />
            <Text style={styles.noResultsText}>No categories found</Text>
            <Text style={styles.noResultsSubText}>
              Try searching with different keywords
            </Text>
          </View>
        )}
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
    paddingTop: Platform.OS === "android" ? 25 : 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    marginTop: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 15,
    marginBottom: 20,
    shadowColor: "#6A11CB",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A11CB",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  list: {
    paddingBottom: 30,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#718096",
    marginTop: 15,
  },
  noResultsSubText: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 5,
  },
});
