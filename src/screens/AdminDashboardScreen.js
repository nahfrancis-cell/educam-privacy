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

const StatsCard = ({ title, value, icon }) => (
  <View style={styles.statsCard}>
    <MaterialIcons name={icon} size={24} color="#34C759" />
    <Text style={styles.statsValue}>{value}</Text>
    <Text style={styles.statsTitle}>{title}</Text>
  </View>
);

const SectionButton = ({ title, icon, onPress, type = 'primary' }) => (
  <TouchableOpacity
    style={[
      styles.button,
      type === 'primary' && styles.primaryButton,
      type === 'secondary' && styles.secondaryButton,
      type === 'danger' && styles.dangerButton,
    ]}
    onPress={onPress}
  >
    <MaterialIcons 
      name={icon} 
      size={24} 
      color="#FFFFFF" 
      style={styles.buttonIcon}
    />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const AdminDashboardScreen = ({ navigation }) => {
  const quickStats = [
    { title: 'Total Users', value: '1,234', icon: 'people' },
    { title: 'Total Questions', value: '5,678', icon: 'question-answer' },
    { title: 'Active Sessions', value: '42', icon: 'timer' },
    { title: 'Subscriptions', value: '890', icon: 'card-membership' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34C759" />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </View>

        {/* Manage Questions */}
        <Section title="Manage Questions">
          <SectionButton title="Add Question" icon="add-circle" onPress={() => navigation.navigate('AddQuestion')} />
          <SectionButton 
            title="Edit Questions" 
            icon="edit" 
            type="secondary" 
            onPress={() => navigation.navigate('EditQuestion')} 
          />
          <SectionButton 
            title="Delete Questions" 
            icon="delete" 
            type="danger" 
            onPress={() => navigation.navigate('DeleteQuestion')} 
          />
        </Section>

        {/* User Management */}
        <Section title="User Management">
          <SectionButton title="View Users" icon="people" onPress={() => navigation.navigate('ViewUsers')} />
          <SectionButton title="Add User" icon="person-add" onPress={() => navigation.navigate('AddUser')} />
          <SectionButton title="Edit Users" icon="edit" type="secondary" onPress={() => navigation.navigate('EditUsers')} />
          <SectionButton title="Deactivate Users" icon="person-off" type="danger" onPress={() => navigation.navigate('DeactivateUsers')} />
        </Section>

        {/* Analytics & Tracking */}
        <Section title="Analytics & Tracking">
          <SectionButton title="User Progress" icon="trending-up" onPress={() => navigation.navigate('UserProgress')} />
          <SectionButton title="Performance Metrics" icon="assessment" onPress={() => navigation.navigate('PerformanceMetrics')} />
          <SectionButton title="Usage Statistics" icon="bar-chart" onPress={() => navigation.navigate('UsageStatistics')} />
        </Section>

        {/* Subscription Management */}
        <Section title="Subscription Management">
          <SectionButton title="View Subscriptions" icon="visibility" onPress={() => navigation.navigate('ViewSubscriptions')} />
          <SectionButton title="Manage Subscriptions" icon="settings" onPress={() => navigation.navigate('ManageSubscriptions')} />
        </Section>

        {/* Content Moderation */}
        <Section title="Content Moderation">
          <SectionButton title="Approve Content" icon="check-circle" onPress={() => navigation.navigate('ApproveContent')} />
          <SectionButton title="Reject Content" icon="cancel" type="danger" onPress={() => navigation.navigate('RejectContent')} />
        </Section>

        {/* System Settings */}
        <Section title="System Settings">
          <SectionButton title="Notification Settings" icon="notifications" onPress={() => navigation.navigate('NotificationSettings')} />
          <SectionButton title="App Theme" icon="palette" onPress={() => navigation.navigate('AppTheme')} />
          <SectionButton title="Password Change" icon="lock" onPress={() => navigation.navigate('PasswordChange')} />
        </Section>

        {/* Support Section */}
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => navigation.navigate('Support')}
        >
          <MaterialIcons name="help-outline" size={20} color="#34C759" />
          <Text style={styles.supportText}>Need Help? Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 140 : 110,
    paddingBottom: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 30,
    zIndex: 1,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    backgroundColor: '#DFFFD6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 8,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#DFFFD6',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#34C759',
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
  },
  dangerButton: {
    backgroundColor: '#DC3545',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 32,
  },
  supportText: {
    marginLeft: 8,
    color: '#34C759',
    fontSize: 16,
  },
});

export default AdminDashboardScreen;
