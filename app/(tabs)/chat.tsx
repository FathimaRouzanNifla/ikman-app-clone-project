import { View, Text, FlatList, TouchableOpacity, Image, Animated, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const chats = [
  {
    id: '1',
    name: 'Fathima',
    lastMessage: 'Hi! Is this iPhone 13 Pro Max still available? I\'m very interested!',
    time: '2 hours ago',
    unread: 2,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    isOnline: true,
    productImage: 'https://images.unsplash.com/photo-1632661674596-618e45e56c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    productName: 'iPhone 13 Pro Max'
  },
  {
    id: '2',
    name: 'Thakshila',
    lastMessage: 'Can you deliver to Kandy? I can pay extra for delivery.',
    time: '1 day ago',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    isOnline: false,
    productImage: 'https://images.unsplash.com/photo-1646753522408-077ef9839300?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    productName: 'Samsung Galaxy S22'
  },
  {
    id: '3',
    name: 'Amor',
    lastMessage: 'What\'s the best price you can do for the MacBook?',
    time: '3 days ago',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    isOnline: true,
    productImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    productName: 'MacBook Pro 2021'
  },
  {
    id: '4',
    name: 'Sarah',
    lastMessage: 'I\'ll take it! When can I come to see it?',
    time: 'Just now',
    unread: 1,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    isOnline: true,
    productImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    productName: 'Canon Camera'
  },
];

export default function ChatList() {
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const openChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderRightActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        style={styles.deleteAction}
        onPress={() => console.log('Delete chat')}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderChatItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={[
        styles.chatItemContainer,
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
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity 
          style={styles.chatItem}
          onPress={() => openChat(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.userImage}
            />
            {item.isOnline && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            
            <Text 
              style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>

            <View style={styles.productPreview}>
              <Image 
                source={{ uri: item.productImage }} 
                style={styles.productImage}
              />
              <Text style={styles.productName} numberOfLines={1}>
                {item.productName}
              </Text>
            </View>
          </View>

          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.moreButton}
            onPress={(e) => {
              e.stopPropagation();
              console.log('More options');
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {chats.length} active conversations
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search conversations...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#6A11CB" />
        </TouchableOpacity>
      </Animated.View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* New Message Button */}
      <Animated.View 
        style={[
          styles.newMessageButtonContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.newMessageButton}
          onPress={() => console.log('New message')}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.newMessageGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  chatItemContainer: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#48BB78',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  timeText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  lastMessage: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
  },
  unreadMessage: {
    color: '#2D3748',
    fontWeight: '600',
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  productImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  productName: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteAction: {
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginLeft: 12,
  },
  newMessageButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  newMessageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newMessageGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});