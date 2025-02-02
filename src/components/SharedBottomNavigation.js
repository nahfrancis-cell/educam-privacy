import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SharedBottomNavigation = ({ navigation }) => {
  const handleTabPress = (tabName) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={styles.bottomNav}>
      {['Home', 'Notes', 'Profile', 'Help'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.navItem}
          onPress={() => handleTabPress(tab)}
        >
          <MaterialIcons
            name={
              tab === 'Home' ? 'home' :
              tab === 'Notes' ? 'note' :
              tab === 'Profile' ? 'person' :
              'help'
            }
            size={24}
            color="#666666"
          />
          <Text style={styles.navText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});

export default SharedBottomNavigation;
