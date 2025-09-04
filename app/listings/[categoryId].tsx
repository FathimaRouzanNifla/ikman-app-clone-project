import { FlatList, View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LISTINGS } from "../../data/dummyData";
import ListingCard from "../../components/ListingCard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get('window');

export default function ListingsScreen() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  
  const categoryName = LISTINGS.find(item => item.categoryId === categoryId)?.category || "Listings";

  const filteredListings = LISTINGS.filter(
    (item) => item.categoryId === categoryId
  );

  // Filter by search query if provided
  const searchedListings = searchQuery 
    ? filteredListings.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredListings;

  // Sort listings
  const sortedListings = [...searchedListings].sort((a, b) => {
    if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    return 0;
  });

  useEffect(() => {
    // Animate screen elements on mount
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
      })
    ]).start();
  }, []);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }
      ]}
    >
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <Text style={styles.resultsCount}>
          {sortedListings.length} {sortedListings.length === 1 ? 'item' : 'items'} found
        </Text>
      </LinearGradient>

      <View style={styles.controlsContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort and View Controls */}
        <View style={styles.controlRow}>
          <View style={styles.sortContainer}>
            <Text style={styles.controlLabel}>Sort by:</Text>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => setSortOption(sortOption === "newest" ? "price-low" : "newest")}
            >
              <Text style={styles.sortText}>
                {sortOption === "newest" ? "Newest" : sortOption === "price-low" ? "Price: Low to High" : "Price: High to Low"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6A11CB" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={toggleViewMode}
          >
            <Ionicons 
              name={viewMode === "grid" ? "grid" : "list"} 
              size={22} 
              color="#6A11CB" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyState,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }
      ]}
    >
      <Ionicons name="search-outline" size={60} color="#ddd" />
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'No listings found' : 'No listings available'}
      </Text>
      <Text style={styles.emptyStateSubText}>
        {searchQuery ? 'Try different keywords' : 'Check back later for new items'}
      </Text>
      {searchQuery && (
        <TouchableOpacity 
          style={styles.clearSearchButton}
          onPress={() => setSearchQuery("")}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 20],
                    outputRange: [0, 10 - (index * 2)]
                  }) 
                }
              ]
            }}
          >
            <ListingCard
              title={item.title}
              price={item.price}
              image={item.image}
              location={item.location}
              timePosted={item.timePosted}
              isFeatured={item.isFeatured}
              onPress={() => router.push(`/listings/details/${item.id}`)}
            />
          </Animated.View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={viewMode === "grid" ? 2 : 1}
        columnWrapperStyle={viewMode === "grid" ? styles.columnWrapper : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resultsCount: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
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
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    color: '#718096',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A11CB',
    marginRight: 6,
  },
  viewToggle: {
    padding: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#718096",
    marginTop: 15,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 5,
    textAlign: 'center',
  },
  clearSearchButton: {
    marginTop: 20,
    backgroundColor: '#6A11CB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  clearSearchText: {
    color: '#fff',
    fontWeight: '600',
  },
});