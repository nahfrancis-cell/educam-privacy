import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';
import { supabase, getSession } from '../config/supabase.config';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const SelectLevelScreen = ({ navigation, route }) => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const session = await getSession();
    if (!session) {
      navigation.replace('Login');
      return;
    }
    fetchLevels();
  };

  const fetchLevels = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to fetch levels...');
      
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching levels:', error);
        Alert.alert('Error', 'Failed to fetch levels. Please try again.');
        return;
      }

      if (!data) {
        console.log('No data returned from levels query');
        setLevels([]);
        return;
      }

      console.log('Successfully fetched levels:', data);
      setLevels(data);
    } catch (error) {
      console.error('Error in fetchLevels:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelSelect = (level) => {
    console.log('Selected level:', level);
    const levelData = {
      id: level.id,
      level_name: level.level_name,
    };
    
    navigation.navigate('TopicAndQuestionType', { 
      level: levelData,
      educationType: route.params?.educationType || 'General Education'
    });
  };

  const handleTabPress = (tabName) => {
    if (tabName === 'Logout') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      navigation.navigate(tabName);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  if (levels.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#34C759" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Level</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No levels available.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchLevels}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomNav}>
          {['Home', 'Notes', 'Profile', 'Help', 'Logout'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab)}
            >
              <MaterialIcons
                name={
                  tab === 'Home' ? 'home' :
                  tab === 'Notes' ? 'note' :
                  tab === 'Profile' ? 'person' :
                  tab === 'Help' ? 'help' :
                  'logout'
                }
                size={24}
                color="#666"
              />
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34C759" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Level</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose Your Level</Text>
        
        {levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={styles.levelCard}
            onPress={() => handleLevelSelect(level)}
          >
            <View style={[styles.iconContainer, { 
              backgroundColor: level.level_name === 'O/L' ? '#007AFF' : '#34C759' 
            }]}>
              <MaterialIcons 
                name={level.level_name === 'O/L' ? 'school' : 'stars'}
                size={32} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>
                {level.level_name === 'O/L' ? 'Ordinary Level' : 'Advanced Level'}
              </Text>
              <Text style={styles.levelDescription}>
                {level.level_name === 'O/L' ? 'GCE O/L examination preparation' : 'GCE A/L examination preparation'}
              </Text>
            </View>
            <View style={styles.chevronContainer}>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {['Home', 'Notes', 'Profile', 'Help', 'Logout'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab)}
          >
            <MaterialIcons
              name={
                tab === 'Home' ? 'home' :
                tab === 'Notes' ? 'note' :
                tab === 'Profile' ? 'person' :
                tab === 'Help' ? 'help' :
                'logout'
              }
              size={24}
              color="#666"
            />
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center',
    marginTop: 30,
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 16,
    zIndex: 1,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginTop: 30,
  },
  content: {
    flex: 1,
    marginTop: 30,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 30,
  },
  levelCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
    marginTop: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  bottomSpacing: {
    height: 80, // Add extra space at the bottom to prevent content from being hidden behind the navigation bar
  },
});

export default SelectLevelScreen;
