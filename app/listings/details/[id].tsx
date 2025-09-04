import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Share, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LISTINGS } from "../../../data/dummyData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = LISTINGS.find((item) => item.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const imageScale = useRef(new Animated.Value(1)).current;

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

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleImagePress = () => {
    Animated.sequence([
      Animated.spring(imageScale, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.title} for Rs. ${product.price}`,
        url: product.image,
        title: product.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <Animated.View 
          style={[
            styles.imageContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: imageScale }] 
            }
          ]}
        >
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageGradient}
            />
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF6B6B" : "#fff"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Ionicons name="share" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {[0, 1, 2].map((index) => (
              <View 
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Product Info */}
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          {/* Price and Status */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs. {product.price}</Text>
            <View style={[styles.statusBadge, { backgroundColor: product.status === 'sold' ? '#E53E3E' : '#38A169' }]}>
              <Text style={styles.statusText}>
                {product.status === 'sold' ? 'Sold' : 'Available'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          
          {/* Location and Date */}
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color="#718096" />
              <Text style={styles.metaText}>{product.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#718096" />
              <Text style={styles.metaText}>{product.timePosted}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsList}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Condition</Text>
                <Text style={styles.specValue}>Excellent</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Category</Text>
                <Text style={styles.specValue}>{product.category}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Brand</Text>
                <Text style={styles.specValue}>Unknown</Text>
              </View>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
                style={styles.sellerImage}
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>Shehar Mavitha</Text>
                <Text style={styles.sellerRating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  4.8 (128 reviews)
                </Text>
                <Text style={styles.sellerMember}>Member since 2023</Text>
              </View>
              <TouchableOpacity style={styles.chatButton}>
                <Ionicons name="chatbubble" size={16} color="#fff" />
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Spacer for fixed button */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Fixed Action Button */}
      <Animated.View 
        style={[
          styles.fixedButtonContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          style={styles.fixedButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.fixedButton}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.fixedButtonText}>Contact Seller</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#718096',
    marginTop: 15,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
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
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 16,
  },
  content: {
    padding: 20,
    paddingTop: 25,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: { 
    fontSize: 28, 
    fontWeight: "800",
    color: '#6A11CB',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700",
    color: '#2D3748',
    marginBottom: 15,
    lineHeight: 30,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 6,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  description: { 
    fontSize: 16, 
    lineHeight: 24,
    color: '#4A5568',
  },
  specsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  specItemLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    fontSize: 14,
    color: '#718096',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  sellerRating: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },
  sellerMember: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A11CB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  chatText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  spacer: {
    height: 90,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  fixedButtonGradient: {
    borderRadius: 12,
    shadowColor: "#6A11CB",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  fixedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  fixedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});