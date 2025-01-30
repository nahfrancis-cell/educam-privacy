import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../config/supabase.config';
import { Platform } from 'react-native';

export default function TopicAndQuestionTypeScreen({ route, navigation }) {
  const { level } = route.params;
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  useEffect(() => {
    // Validate the level parameter
    if (!level || !level.id) {
      console.error('Invalid level parameter:', level);
      Alert.alert(
        'Error',
        'Invalid level selected. Please go back and select a level again.',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack()
          }
        ]
      );
      return;
    }

    console.log('Route Params:', route.params);
    console.log('Level:', level);
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchTopics(selectedSubject.id);
    }
  }, [selectedSubject]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      console.log('Fetching subjects for level ID:', level.id);
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('level_id', level.id)
        .order('subject_name');

      if (subjectsError) {
        console.error('Subjects fetch error:', subjectsError);
        throw subjectsError;
      }
      console.log('Fetched subjects:', subjectsData);
      setSubjects(subjectsData || []);

      console.log('Fetching question types');
      const { data: typesData, error: typesError } = await supabase
        .from('question_types')
        .select('*')
        .order('type_name');

      if (typesError) {
        console.error('Question types fetch error:', typesError);
        throw typesError;
      }
      console.log('Fetched question types:', typesData);
      setQuestionTypes(typesData || []);
    } catch (error) {
      console.error('Error in fetchData:', error);
      Alert.alert('Error', 'Failed to load data. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async (subjectId) => {
    try {
      console.log('Fetching topics for subject ID:', subjectId);
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .order('topic_name');

      if (topicsError) {
        console.error('Topics fetch error:', topicsError);
        throw topicsError;
      }
      console.log('Fetched topics:', topicsData);
      setTopics(topicsData || []);
      setSelectedTopic(null); // Reset selected topic when subject changes
    } catch (error) {
      console.error('Error in fetchTopics:', error);
      Alert.alert('Error', 'Failed to load topics. ' + error.message);
    }
  };

  const handleContinue = () => {
    if (!selectedTopic || !selectedQuestionType) {
      Alert.alert('Selection Required', 'Please select both a topic and question type');
      return;
    }

    // Get the question type name in lowercase for comparison
    const questionTypeName = selectedQuestionType.type_name.toLowerCase();

    // Format topic data to match expected structure
    const topicData = {
      ...selectedTopic,
      value: selectedTopic.id  // Add value property expected by question screens
    };

    console.log('Selected Topic Data:', topicData);
    console.log('Selected Question Type:', selectedQuestionType);

    // Navigate based on question type
    if (questionTypeName.includes('mcq') || questionTypeName.includes('multiple choice')) {
      navigation.navigate('MCQQuestion', {
        level,
        subject: selectedSubject,
        topic: topicData,
        questionType: 'MCQ'
      });
    } else if (questionTypeName.includes('structural') || questionTypeName.includes('structure')) {
      console.log('Navigating to Structural with params:', {
        level,
        subject: selectedSubject,
        topic: topicData,
        questionType: 'Structural'
      });
      
      navigation.navigate('StructuralQuestion', {
        level,
        subject: selectedSubject,
        topic: topicData,
        questionType: 'Structural'
      });
    } else {
      Alert.alert('Error', 'Invalid question type selected');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34C759" />
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>Select Options</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Subject</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedSubject && styles.placeholderText
              ]}>
                {selectedSubject ? selectedSubject.subject_name : 'Select a subject'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666666" />
            </TouchableOpacity>
            {showSubjectPicker && (
              <ScrollView style={styles.pickerContainer} nestedScrollEnabled={true}>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.pickerItem,
                      selectedSubject?.id === subject.id && styles.selectedPickerItem
                    ]}
                    onPress={() => {
                      setSelectedSubject(subject);
                      setShowSubjectPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedSubject?.id === subject.id && styles.selectedPickerItemText
                    ]}>
                      {subject.subject_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Topic</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowTopicPicker(showTopicPicker => !showTopicPicker)}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedTopic && styles.placeholderText
              ]}>
                {selectedTopic ? selectedTopic.topic_name : 'Select topic'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666666" />
            </TouchableOpacity>
            {showTopicPicker && (
              <ScrollView style={styles.pickerContainer} nestedScrollEnabled={true}>
                {topics.map((topic) => (
                  <TouchableOpacity
                    key={topic.id}
                    style={[
                      styles.pickerItem,
                      selectedTopic?.id === topic.id && styles.selectedPickerItem
                    ]}
                    onPress={() => {
                      setSelectedTopic(topic);
                      setShowTopicPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedTopic?.id === topic.id && styles.selectedPickerItemText
                    ]}>
                      {topic.topic_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Question Type</Text>
            <View style={styles.radioContainer}>
              {questionTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.radioOption}
                  onPress={() => setSelectedQuestionType(type)}
                >
                  <View style={styles.radioButtonContainer}>
                    <MaterialIcons 
                      name={selectedQuestionType?.id === type.id ? "radio-button-checked" : "radio-button-unchecked"} 
                      size={24} 
                      color={selectedQuestionType?.id === type.id ? "#4CAF50" : "#666666"}
                    />
                    <Text style={[
                      styles.radioText,
                      selectedQuestionType?.id === type.id && styles.selectedRadioText
                    ]}>
                      {type.type_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedTopic || !selectedQuestionType) && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!selectedTopic || !selectedQuestionType}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f2e0',
  },
  returnButton: {
    padding: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    zIndex: 3,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#AAAAAA',  
    fontWeight: '400', 
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 150,
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedPickerItem: {
    backgroundColor: '#e8f5e9',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPickerItemText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  radioContainer: {
    marginTop: 8,
  },
  radioOption: {
    marginBottom: 12,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  selectedRadioText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
