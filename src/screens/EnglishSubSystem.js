import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';
import SharedBottomNavigation from '../components/SharedBottomNavigation';

const EnglishSubSystem = ({ navigation }) => {
  const educationTypes = [
    {
      id: 1,
      title: 'General Education',
      icon: 'menu-book',
      color: '#34C759', // Green for General Education
      description: 'Arts and Science subjects following the GCE curriculum',
      subjects: [
        'English Language',
        'English Literature',
        'Mathematics',
        'Biology',
        'Chemistry',
        'Physics',
        'History',
        'Geography',
        'Economics'
      ]
    },
    {
      id: 2,
      title: 'Technical Education',
      icon: 'build',
      color: '#007AFF', // Blue for Technical Education
      description: 'Engineering, Construction, and Technical subjects',
    },
    {
      id: 3,
      title: 'Commercial Education',
      icon: 'business',
      color: '#FF9500', // Orange for Commercial Education
      description: 'Business, Accounting, and Commerce subjects',
    },
  ];

  const handleEducationTypeSelect = (typeId) => {
    const selectedType = educationTypes.find(type => type.id === typeId);
    
    // Only allow navigation for General Education (id: 1)
    if (typeId === 1) {
      navigation.navigate('SelectLevel', {
        educationType: selectedType.title,
        subjects: selectedType.subjects
      });
    } else {
      Alert.alert(
        'Coming Soon',
        'This section is not yet completed. Please check back later.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34C759" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>English System</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {educationTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={styles.card}
            onPress={() => handleEducationTypeSelect(type.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
              <MaterialIcons name={type.icon} size={32} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{type.title}</Text>
              <Text style={styles.cardDescription}>{type.description}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About English System</Text>
          <Text style={styles.infoText}>
            The English subsystem of education in Cameroon follows the GCE (General Certificate 
            of Education) pattern, offering Ordinary and Advanced levels in various streams including 
            General, Technical, and Commercial education.
          </Text>
        </View>

        {/* Add bottom spacing to prevent content from being hidden by navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <SharedBottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f0',
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 85, // Add padding for bottom navigation
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
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

export default EnglishSubSystem;
