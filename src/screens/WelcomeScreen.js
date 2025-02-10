import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollView}>
          <ImageBackground
            source={require('../assets/images/educam_logo.png')}
            style={styles.headerBackground}
            resizeMode="contain"
          >
            <View style={[styles.headerOverlay, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, color: '#000000' }]}>EDUCAM</Text>
                <Text style={[styles.subtitle, { textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, color: '#000000' }]}>Excellence in Cameroon Education</Text>
                <Text style={[styles.headerText, { textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, color: '#000000' }]}>Your Bilingual Learning Companion</Text>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.contentContainer}>
            <View style={styles.imageSection}>
              <Image
                source={require('../assets/images/gbhs_mbouda.png')}
                style={styles.sectionImage}
                resizeMode="cover"
              />
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="people" size={32} color="#000000" />
                  <Text style={styles.sectionTitle}>Welcome to Educam</Text>
                </View>
                <Text style={styles.welcomeText}>
                  Welcome to your comprehensive educational companion designed specifically for Cameroon's unique bilingual education system. Whether you're preparing for GCE (O/L & A/L), BAC, PROBATOIRE, BEPC, or other national exams, we're here to support your journey to excellence.
                </Text>
              </View>
            </View>

            <View style={styles.imageSection}>
              <Image
                source={require('../assets/images/minesec.png')}
                style={styles.sectionImage}
                resizeMode="cover"
              />
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="menu-book" size={32} color="#000000" />
                  <Text style={styles.sectionTitle}>Our Approach</Text>
                </View>
                <Text style={styles.featureText}>
                  Experience a revolutionary way of learning with our extensive collection of past questions, comprehensive study materials in both English and French, and expertly crafted practice tests. From Multiple Choice Questions to detailed Structural Questions, we've got you covered.
                </Text>
              </View>
            </View>

            <View style={[styles.highlightSection, styles.section]}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="stars" size={32} color="#000000" />
                <Text style={styles.highlightTitle}>What We Offer</Text>
              </View>
              <View style={styles.bulletPoints}>
                <View style={styles.bulletPoint}>
                  <MaterialIcons name="check-circle" size={24} color="#000000" />
                  <Text style={styles.bulletText}>Complete past Sylable coverage for all major Cameroon exams</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <MaterialIcons name="check-circle" size={24} color="#000000" />
                  <Text style={styles.bulletText}>Bilingual study materials (English & French)</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <MaterialIcons name="check-circle" size={24} color="#000000" />
                  <Text style={styles.bulletText}>Smart performance tracking and analytics</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <MaterialIcons name="check-circle" size={24} color="#000000" />
                  <Text style={styles.bulletText}>Multiple Choice & Structural Questions</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <MaterialIcons name="check-circle" size={24} color="#000000" />
                  <Text style={styles.bulletText}>Personalized learning paths</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <MaterialIcons name="check-circle" size={24} color="#000000" />
                  <Text style={styles.bulletText}>Expert-verified content</Text>
                </View>
              </View>
            </View>

            <View style={styles.missionContainer}>
              <Image
                source={require('../assets/images/gbhs_mbouda_campus.png')}
                style={[styles.sectionImage, { marginBottom: 0 }]}
                resizeMode="cover"
              />

              <View style={[styles.section, styles.missionSection]}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="emoji-objects" size={32} color="#000000" />
                  <Text style={styles.sectionTitle}>Our Mission</Text>
                </View>
                <Text style={styles.missionText}>
                  Our mission is to empower Cameroonian students with the best educational resources, helping you master your subjects and achieve outstanding results. Join us in making the Cameroon education system great again through technology and innovation.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.createAccountButtonText}>Create Your Account</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginBottom: 120, // Add space for the bottom buttons
  },
  headerBackground: {
    width: '100%',
    height: Platform.OS === 'ios' ? 300 : 280,
  },
  headerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 15,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 8,
    fontWeight: '500',
  },
  headerText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  imageSection: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionImage: {
    width: '100%',
    height: 150,
  },
  section: {
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000000',
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  highlightSection: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  highlightTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000000',
  },
  bulletPoints: {
    marginTop: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 10,
  },
  bulletText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: '#000000',
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  missionContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  missionSection: {
    padding: 15,
  },
  createAccountButton: {
    backgroundColor: '#34C759',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  createAccountButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  loginText: {
    fontSize: 18,
    color: '#000000',
  },
  loginLink: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});

export default WelcomeScreen;
