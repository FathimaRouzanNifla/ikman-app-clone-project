import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function NotFoundScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ])
      ),
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        })
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          })
        ])
      )
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page Not Found',
        headerStyle: {
          backgroundColor: '#6A11CB',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        }
      }} />
      
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          {/* Animated 404 Illustration */}
          <Animated.View 
            style={[
              styles.illustrationContainer,
              { transform: [{ translateY: bounce }] }
            ]}
          >
            <Animated.View style={[styles.circle, { transform: [{ rotate }] }]}>
              <Ionicons name="warning" size={50} color="#FFD700" />
            </Animated.View>
            <View style={styles.numberContainer}>
              <Text style={styles.number}>4</Text>
              <Text style={styles.number}>0</Text>
              <Text style={styles.number}>4</Text>
            </View>
          </Animated.View>

          {/* Message */}
          <Text style={styles.title}>
            Oops! Page Not Found
          </Text>
          
          <Text style={styles.subtitle}>
            The page you are looking for doesn't exist or has been moved.
          </Text>

          {/* Action Button */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Link href="/" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="home" size={22} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.linkText}>Go to Home Screen</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Additional Options */}
          <View style={styles.options}>
            <Text style={styles.optionsTitle}>Or try:</Text>
            <View style={styles.optionButtons}>
              <Link href="/search" asChild>
                <TouchableOpacity style={styles.optionButton}>
                  <Ionicons name="search" size={18} color="#6A11CB" />
                  <Text style={styles.optionText}>Search</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/profile" asChild>
                <TouchableOpacity style={styles.optionButton}>
                  <Ionicons name="person" size={18} color="#6A11CB" />
                  <Text style={styles.optionText}>Profile</Text>
                </TouchableOpacity>
              </Link>
              
            </View>
          </View>
        </Animated.View>

        {/* Floating particles for visual interest */}
        <Animated.View style={[styles.particle, styles.particle1, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View style={[styles.particle, styles.particle2, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View style={[styles.particle, styles.particle3, { transform: [{ scale: pulseAnim }] }]} />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  numberContainer: {
    flexDirection: 'row',
  },
  number: {
    fontSize: 70,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 35,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 35,
  },
  linkButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  buttonIcon: {
    marginRight: 12,
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  options: {
    alignItems: 'center',
  },
  optionsTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    fontSize: 16,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    gap: 6,
  },
  optionText: {
    color: '#6A11CB',
    fontSize: 14,
    fontWeight: '600',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle1: {
    width: 80,
    height: 80,
    top: '15%',
    right: '10%',
  },
  particle2: {
    width: 50,
    height: 50,
    bottom: '20%',
    left: '15%',
  },
  particle3: {
    width: 30,
    height: 30,
    top: '40%',
    left: '5%',
  },
});