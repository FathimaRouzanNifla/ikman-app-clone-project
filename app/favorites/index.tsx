import { View, Text, FlatList, Image, TouchableOpacity, Animated, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const favorites = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max 256GB - Silver',
    price: '250,000 LKR',
    image: 'https://images.unsplash.com/photo-1632661674596-618e45e56c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    time: '2 days ago',
    location: 'Colombo',
    isSold: false,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Samsung Galaxy S22 Ultra 512GB - Phantom Black',
    price: '220,000 LKR',
    image: 'https://images.unsplash.com/photo-1632661674596-618e45e56c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    time: '5 days ago',
    location: 'Kandy',
    isSold: false,
    rating: 4.5
  },
  {
    id: '3',
    title: 'MacBook Pro 2021 16" M1 Max - Space Gray',
    price: '450,000 LKR',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    time: '1 week ago',
    location: 'Galle',
    isSold: true,
    rating: 4.9
  },
  {
    id: '4',
    title: 'Canon EOS R5 Mirrorless Camera',
    price: '380,000 LKR',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    time: '3 days ago',
    location: 'Negombo',
    isSold: false,
    rating: 4.7
  },
];

export default function Favorites() {
  const [favoritesList, setFavoritesList] = useState(favorites);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const router = useRouter();

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

  const removeFavorite = (id: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this item from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavoritesList(prev => prev.filter(item => item.id !== id));
            // Show success message
            Alert.alert('Removed', 'Item removed from favorites');
          },
        },
      ]
    );
  };

  const clearAllFavorites = () => {
    if (favoritesList.length === 0) return;
    
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all items from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setFavoritesList([]);
            Alert.alert('Cleared', 'All favorites have been removed');
          },
        },
      ]
    );
  };

  const navigateToItem = (item: any) => {
    router.push("/not-found");
  };

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
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color="#e2e8f0" />
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.emptyIconCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="heart" size={40} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>No saved items yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any listing to save it here for later.
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => router.push('/search')}
      >
        <Text style={styles.browseButtonText}>Browse Listings</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFavoriteItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={[
        styles.favoriteItem,
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
      <TouchableOpacity 
        style={styles.itemContent}
        onPress={() => navigateToItem(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.itemImage}
          />
          {item.isSold && (
            <View style={styles.soldOverlay}>
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#718096" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="#718096" />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
          </View>

          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>

        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.removeButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="heart" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

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
          <Text style={styles.headerTitle}>Saved Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {favoritesList.length} {favoritesList.length === 1 ? 'item' : 'items'} saved
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {favoritesList.length > 0 && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearAllFavorites}
            >
              <Ionicons name="trash-outline" size={18} color="#718096" />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {favoritesList.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={favoritesList}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    marginTop: 15,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    marginLeft: 6,
    color: '#718096',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 30,
  },
  favoriteItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  soldOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  soldText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    transform: [{ rotate: '-20deg' }],
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 1,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
    lineHeight: 22,
  },
  metaContainer: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 6,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6A11CB',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  emptyIconCircle: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  browseButton: {
    backgroundColor: '#6A11CB',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6A11CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});