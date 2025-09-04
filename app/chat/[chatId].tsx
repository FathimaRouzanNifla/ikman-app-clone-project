import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated, StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const messages = [
  { 
    id: '1', 
    text: 'Hello, is this iPhone 13 Pro Max still available? I\'m very interested!', 
    sender: 'other', 
    time: '10:30 AM',
    read: true
  },
  { 
    id: '2', 
    text: 'Yes, it is available! The phone is in perfect condition with all original accessories.', 
    sender: 'me', 
    time: '10:32 AM',
    read: true
  },
  { 
    id: '3', 
    text: 'That\'s great! What is your best price?', 
    sender: 'other', 
    time: '10:33 AM',
    read: true
  },
  { 
    id: '4', 
    text: 'I can do 250,000 LKR. It\'s negotiable though.', 
    sender: 'me', 
    time: '10:35 AM',
    read: true
  },
  { 
    id: '5', 
    text: 'Can you deliver to Colombo? I can pay extra for delivery.', 
    sender: 'other', 
    time: '10:36 AM',
    read: false
  },
  { 
    id: '6', 
    text: 'Sure, I can deliver to Colombo for an additional 2,000 LKR.', 
    sender: 'me', 
    time: 'Just now',
    read: false
  },
];

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const flatListRef = useRef(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const inputScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate screen elements on mount
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

    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        time: 'Just now',
        read: false
      };

      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Auto-reply simulation
      setTimeout(() => {
        const autoReply = {
          id: Date.now().toString(),
          text: 'That sounds good! When can I come to see it?',
          sender: 'other',
          time: 'Just now',
          read: false
        };
        setChatMessages(prev => [...prev, autoReply]);
      }, 2000);

      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleInputFocus = () => {
    Animated.spring(inputScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.spring(inputScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessageContainer : styles.theirMessageContainer,
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
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessageBubble : styles.theirMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
        ]}>
          {item.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timeText,
            item.sender === 'me' ? styles.myTimeText : styles.theirTimeText
          ]}>
            {item.time}
          </Text>
          
          {item.sender === 'me' && (
            <Ionicons 
              name={item.read ? "checkmark-done" : "checkmark"} 
              size={14} 
              color={item.read ? "#6A11CB" : "#A0AEC0"} 
              style={styles.readIcon}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
              style={styles.userImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userStatus}>Online now</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Product Info Bar */}
      <Animated.View 
        style={[
          styles.productBar,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1632661674596-618e45e56c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>iPhone 13 Pro Max 256GB</Text>
          <Text style={styles.productPrice}>Rs. 250,000</Text>
        </View>
        <TouchableOpacity style={styles.productButton}>
          <Text style={styles.productButtonText}>View</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <Animated.View 
        style={[
          styles.inputContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: inputScale }] 
          }
        ]}
      >
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color="#6A11CB" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#A0AEC0"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, !message && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!message}
        >
          <LinearGradient
            colors={message ? ['#FF6B6B', '#FF8E53'] : ['#CBD5E0', '#CBD5E0']}
            style={styles.sendButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Decorative Elements */}
      <Animated.View style={[styles.decoration1, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.decoration2, { opacity: fadeAnim }]} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  callButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  productBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginTop: -10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6A11CB',
  },
  productButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
  },
  productButtonText: {
    color: '#6A11CB',
    fontWeight: '600',
    fontSize: 12,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  myMessageBubble: {
    backgroundColor: '#6A11CB',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#2D3748',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  timeText: {
    fontSize: 11,
    marginRight: 4,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirTimeText: {
    color: '#A0AEC0',
  },
  readIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  attachmentButton: {
    padding: 8,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#2D3748',
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decoration1: {
    position: 'absolute',
    top: '30%',
    left: '5%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    zIndex: -1,
  },
  decoration2: {
    position: 'absolute',
    bottom: '20%',
    right: '8%',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(106, 17, 203, 0.1)',
    zIndex: -1,
  },
});