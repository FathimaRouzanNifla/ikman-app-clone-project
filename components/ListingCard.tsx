import { Pressable, Text, Image, StyleSheet, View, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from "react";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

type Props = {
  title: string;
  price: string;
  image: string;
  onPress: () => void;
  location?: string;
  timePosted?: string;
  isFeatured?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
};

export default function ListingCard({ 
  title, 
  price, 
  image, 
  onPress, 
  location = "Colombo", 
  timePosted = "2 hours ago",
  isFeatured = false,
  isFavorite = false,
  onFavoritePress 
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        styles.cardContainer,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }] 
        }
      ]}
    >
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* Image with gradient overlay and favorite button */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />
          
          {/* Featured badge */}
          {isFeatured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="flash" size={12} color="#fff" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          
          {/* Favorite button */}
          <Pressable 
            style={styles.favoriteButton}
            onPress={onFavoritePress}
            hitSlop={10}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={22} 
              color={isFavorite ? "#FF6B6B" : "#fff"} 
            />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={14} color="#718096" />
              <Text style={styles.detailText}>{location}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color="#718096" />
              <Text style={styles.detailText}>{timePosted}</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>Rs. {price}</Text>
            
            {/* Condition tag */}
            <View style={styles.conditionTag}>
              <Text style={styles.conditionText}>Excellent</Text>
            </View>
          </View>
        </View>

        {/* Quick action buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.chatButton}>
            <Ionicons name="chatbubble" size={16} color="#fff" />
            <Text style={styles.chatText}>Chat</Text>
          </Pressable>
          
          <Pressable style={styles.callButton}>
            <Ionicons name="call" size={16} color="#6A11CB" />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH, 
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  imageContainer: {
    position: 'relative',
    height: 160, 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  image: { 
    width: '100%', 
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12, 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "700",
    color: '#2D3748',
    marginBottom: 8,
    lineHeight: 22,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  priceContainer: {
   flexDirection: "column", 
    alignItems: "flex-start",
    marginBottom: 6,
    
  },
  price: { 
    fontSize: 16, 
    fontWeight: "800",
    color: '#6A11CB',
    
  },
  conditionTag: {
    backgroundColor: '#E9D8FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6A11CB',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    padding: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A11CB',
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  chatText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  callButton: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
  },
});