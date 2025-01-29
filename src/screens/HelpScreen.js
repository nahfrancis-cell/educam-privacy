import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HelpScreen = ({ navigation }) => {
  const helpTopics = [
    {
      title: 'Getting Started',
      icon: 'play-circle-fill',
      description: 'Learn how to use the app and navigate through different sections.',
    },
    {
      title: 'Education Systems',
      icon: 'school',
      description: 'Understanding the English and French education systems in Cameroon.',
    },
    {
      title: 'Study Materials',
      icon: 'menu-book',
      description: 'How to access and use study materials effectively.',
    },
    {
      title: 'Practice Questions',
      icon: 'assignment',
      description: 'Tips for practicing questions and tracking your progress.',
    },
    {
      title: 'Account Settings',
      icon: 'settings',
      description: 'Managing your profile and app preferences.',
    },
    {
      title: 'Contact Support',
      icon: 'support-agent',
      description: 'Get in touch with our support team for assistance.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34C759" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {helpTopics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicCard}
            onPress={() => {
              // Handle topic selection
              // navigation.navigate('HelpDetail', { topic });
              alert('Coming soon: Detailed help for ' + topic.title);
            }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name={topic.icon} size={28} color="#34C759" />
            </View>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need More Help?</Text>
          <Text style={styles.contactText}>
            If you can't find what you're looking for, our support team is here to help.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => {
              // Handle contact support
              alert('Support contact feature coming soon!');
            }}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Add bottom spacing to prevent content from being hidden by navigation */}
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
  topicCard: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  topicDescription: {
    fontSize: 14,
    color: '#666666',
  },
  contactSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  contactText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HelpScreen;
