import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, View, Animated, Easing, Dimensions } from "react-native";
import { useRef, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

function FloatingTabButton({ children, onPress }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 1, duration: 150, easing: Easing.ease, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 250, easing: Easing.elastic(1.5), useNativeDriver: true }),
    ]).start();
    setTimeout(() => onPress?.(), 100);
  };

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '135deg'] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.floatingButton}>
        <Animated.View style={[styles.floatingIcon, { transform: [{ scale: scaleAnim }, { rotate }], shadowOpacity: glowOpacity }]}>
          <LinearGradient colors={['#FF6B6B', '#FF8E53']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
            {children}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Wrap Tabs inside GestureHandlerRootView
export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#6A11CB",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                <Ionicons name="home" color={color} size={size} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                <Ionicons name="search" color={color} size={size} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="postad"
          options={{
            title: "",
            tabBarIcon: () => null,
            tabBarButton: (props) => <FloatingTabButton {...props}><Ionicons name="add" size={32} color="#fff" /></FloatingTabButton>,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                <Ionicons name="chatbubble" color={color} size={size} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                <Ionicons name="person" color={color} size={size} />
              </View>
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 70,
    shadowColor: "#6A11CB",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 0,
  },
  tabLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: -2 
  },
  tabIcon: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 0, 
    marginTop: 2, 
    borderRadius: 16 
  },
  tabIconFocused: { 
    backgroundColor: 'rgba(106, 17, 203, 0.1)', 
    transform: [{ translateY: -3 }] 
  },
  floatingButtonContainer: { 
    top: -30, 
    justifyContent: "center", 
    alignItems: "center", 
    width: width / 5, 
    height: 60 
  },
  floatingButton: { 
    justifyContent: "center", 
    alignItems: "center"
  },
  floatingIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    shadowColor: "#FF6B6B", 
    shadowOpacity: 0.4, 
    shadowOffset: { width: 0, height: 5 }, 
    shadowRadius: 10, elevation: 8 
  },
  gradient: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 30, 
    justifyContent: "center", 
    alignItems: "center" 
  },
});
