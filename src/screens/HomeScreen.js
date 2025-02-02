import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const handleSystemSelect = (system) => {
    if (system === 'English') {
      navigation.navigate('MainStack', { 
        screen: 'EnglishSubSystem'
      });
    } else if (system === 'French') {
      // Future implementation for French system
      alert('French system coming soon!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { marginLeft: 0 }]}>Education Systems</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose Your Education System</Text>
        
        {/* Education Systems */}
        <View style={styles.systemsContainer}>
          {/* English System */}
          <TouchableOpacity 
            style={styles.systemCard}
            onPress={() => handleSystemSelect('English')}
          >
            <MaterialIcons name="school" size={40} color="#34C759" />
            <Text style={styles.systemTitle}>English System</Text>
            <Text style={styles.systemDescription}>
              General Education, Technical Education, and Commercial Education
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color="#666666" />
          </TouchableOpacity>

          {/* French System */}
          <TouchableOpacity 
            style={styles.systemCard}
            onPress={() => handleSystemSelect('French')}
          >
            <MaterialIcons name="account-balance" size={40} color="#007AFF" />
            <Text style={styles.systemTitle}>French System</Text>
            <Text style={styles.systemDescription}>
              Enseignement Général et Technique
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Cameroon Education</Text>
          <Text style={styles.infoText}>
            Cameroon operates a bilingual education system with both English and French 
            as languages of instruction. Each system has its unique curriculum and 
            examination patterns.
          </Text>
        </View>
        
        {/* Add bottom padding to ensure content is not hidden by navigation bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 16,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 85, // Add padding for bottom navigation
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000000',
  },
  systemsContainer: {
    gap: 16,
  },
  systemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  systemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#000000',
  },
  systemDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;
