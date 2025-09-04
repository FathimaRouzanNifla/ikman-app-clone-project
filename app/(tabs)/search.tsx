import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Text, 
  Dimensions 
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { LISTINGS } from "../../data/dummyData";
import ListingCard from "../../components/ListingCard";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const filtered = LISTINGS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
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

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <View style={styles.container}>
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
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Text style={styles.header}>Search Listings</Text>
          <Text style={styles.subHeader}>Find what you're looking for</Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.searchContainer,
            { 
              transform: [{ scale: scaleValue }],
              opacity: fadeAnim 
            }
          ]}
        >
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {filtered.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
              </Text>
              <TouchableOpacity>
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              key={2}
              renderItem={({ item, index }) => (
                <Animated.View
                  style={[
                    styles.cardWrapper,
                    {
                      opacity: fadeAnim,
                      transform: [
                        { 
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 30],
                            outputRange: [0, 10 - (index * 2)]
                          }) 
                        }
                      ]
                    }
                  ]}
                >
                  <ListingCard
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    location={item.location}
                    timePosted={item.timePosted}
                    onPress={() => router.push(`/listings/details/${item.id}`)}
                  />
                </Animated.View>
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              numColumns={2} 
              columnWrapperStyle={{ justifyContent: "space-between" }}
            />
          </>
        ) : query.length > 0 ? (
          <Animated.View 
            style={[
              styles.noResults,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Ionicons name="search-outline" size={60} color="#ddd" />
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubText}>
              Try different keywords or browse categories
            </Text>
          </Animated.View>
        ) : (
          <Animated.View 
            style={[
              styles.initialState,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Ionicons name="search" size={70} color="#e2e8f0" />
            <Text style={styles.initialStateText}>Start searching</Text>
            <Text style={styles.initialStateSubText}>
              Enter keywords to find listings
            </Text>
            
            <View style={styles.popularSearches}>
              <Text style={styles.popularTitle}>Popular Searches</Text>
              <View style={styles.chipContainer}>
                <TouchableOpacity 
                  style={styles.chip}
                  onPress={() => setQuery("iPhone")}
                >
                  <Text style={styles.chipText}>iPhone</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.chip}
                  onPress={() => setQuery("Car")}
                >
                  <Text style={styles.chipText}>Car</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.chip}
                  onPress={() => setQuery("Apartment")}
                >
                  <Text style={styles.chipText}>Apartment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  headerGradient: {
    paddingTop: 60,
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
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  clearButton: {
    padding: 5,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#718096",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A11CB",
  },
  listContainer: {
    paddingBottom: 30,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
    marginHorizontal: 10 
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  initialStateText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A5568",
    marginTop: 15,
  },
  initialStateSubText: {
    fontSize: 14,
    color: "#718096",
    marginTop: 5,
    marginBottom: 30,
  },
  popularSearches: {
    width: '100%',
    alignItems: 'center',
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  chipText: {
    color: '#4A5568',
    fontWeight: '500',
  },
});
