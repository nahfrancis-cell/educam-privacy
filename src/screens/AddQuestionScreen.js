import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../config/supabase.config';

const DropdownField = ({ label, value, options = [], onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={value ? styles.selectedText : styles.placeholderText}>
          {value || placeholder}
        </Text>
        <MaterialIcons 
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color="#34C759" 
        />
      </TouchableOpacity>
      
      {isOpen && options.length > 0 && (
        <View style={styles.optionsContainer}>
          <ScrollView style={styles.optionsList} nestedScrollEnabled={true}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  value === option && styles.selectedOption
                ]}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  value === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const AddQuestionScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    level: '',
    subject: '',
    topic: '',
    questionType: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
  });

  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);

  // Hardcode the levels since they're fixed
  const levels = ['O-Level', 'A-Level'];

  useEffect(() => {
    if (formData.subject) {
      fetchTopics();
    }
  }, [formData.subject]);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('count');

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Connected to Supabase successfully!');
      console.log('Supabase connection test successful');
      fetchSubjects(); // Fetch subjects after successful connection
    } catch (error) {
      console.error('Supabase connection error:', error);
      setError(error.message);
      Alert.alert('Connection Error', 'Failed to connect to database: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching subjects for level:', formData.level);

      const { data, error } = await supabase
        .from('subjects')
        .select('subject_name, level_id')
        .eq('level_id', formData.level === 'O-Level' ? 1 : 2);

      if (error) throw error;

      console.log('Subjects data:', data);

      if (data && data.length > 0) {
        const subjectNames = data.map(subject => subject.subject_name);
        console.log('Available subjects:', subjectNames);
        setSubjects(subjectNames);
      } else {
        console.log('No subjects found for level:', formData.level);
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError(error.message);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async () => {
    if (!formData.subject) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching topics for subject:', formData.subject);

      // First get the subject_id
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_name', formData.subject)
        .eq('level_id', formData.level === 'O-Level' ? 1 : 2)
        .single();

      if (subjectError) throw subjectError;

      console.log('Subject data:', subjectData);
      
      if (!subjectData) {
        console.log('No subject found with name:', formData.subject);
        setTopics([]);
        return;
      }

      // Now fetch topics using subject_id
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('topic_name')
        .eq('subject_id', subjectData.id);

      if (topicsError) throw topicsError;

      console.log('Topics raw data:', topicsData);

      if (topicsData && topicsData.length > 0) {
        const topicNames = topicsData.map(topic => topic.topic_name);
        console.log('Available topics:', topicNames);
        setTopics(topicNames);
      } else {
        console.log('No topics found for subject_id:', subjectData.id);
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error.message);
      setError(error.message);
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.level || !formData.subject || !formData.topic || !formData.questionType || !formData.questionText) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting question with data:', formData);

      // First get the subject_id
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_name', formData.subject)
        .eq('level_id', formData.level === 'O-Level' ? 1 : 2)
        .single();

      if (subjectError) throw subjectError;

      if (!subjectData) {
        throw new Error('Subject not found');
      }

      // Get the topic_id
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('id')
        .eq('topic_name', formData.topic)
        .eq('subject_id', subjectData.id)
        .single();

      if (topicError) throw topicError;

      if (!topicData) {
        throw new Error('Topic not found');
      }

      // Prepare the question data - removing fields that don't exist in the table
      const questionData = {
        level_id: formData.level === 'O-Level' ? 1 : 2,
        subject_id: subjectData.id,
        topic_id: topicData.id,
        type: formData.questionType === 'MCQ (Multiple Choice Questions)' ? 'MCQ' : 'Structural', // Changed from question_type to type
        text: formData.questionText, // Changed from question_text to text
        explanation: formData.explanation || null
      };

      // Only add MCQ-specific fields if it's an MCQ question
      if (formData.questionType === 'MCQ (Multiple Choice Questions)') {
        questionData.options = {
          A: formData.optionA,
          B: formData.optionB,
          C: formData.optionC,
          D: formData.optionD
        };
        questionData.answer = formData.correctAnswer; // Changed from correct_answer to answer
      }

      console.log('Inserting question with data:', questionData);

      // Insert the question
      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
        .single();

      if (error) throw error;

      console.log('Question added successfully:', data);

      Alert.alert(
        'Success',
        'Question added successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form data
              setFormData({
                level: '',
                subject: '',
                topic: '',
                questionType: '',
                questionText: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                correctAnswer: '',
                explanation: '',
              });
              // Navigate back
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding question:', error);
      Alert.alert('Error', 'Failed to add question: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={testSupabaseConnection}
        >
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34C759" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Question</Text>
        <MaterialIcons name="add-circle" size={24} color="#34C759" style={styles.headerIcon} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.form}>
          <View style={[styles.dropdownContainer, { zIndex: 4000 }]}>
            <DropdownField
              label="Level"
              value={formData.level}
              options={levels}
              onSelect={(value) => {
                console.log('Selected level:', value);
                setFormData({ ...formData, level: value, subject: '', topic: '' });
                fetchSubjects();
              }}
              placeholder="Select the exam level"
            />
          </View>

          <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
            <DropdownField
              label="Subject"
              value={formData.subject}
              options={subjects}
              onSelect={(value) => {
                console.log('Selected subject:', value);
                setFormData({ ...formData, subject: value, topic: '' });
              }}
              placeholder="Select the subject"
            />
          </View>

          <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
            <DropdownField
              label="Topic"
              value={formData.topic}
              options={topics}
              onSelect={(value) => {
                console.log('Selected topic:', value);
                setFormData({ ...formData, topic: value });
              }}
              placeholder="Select the topic"
            />
          </View>

          <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
            <DropdownField
              label="Question Type"
              value={formData.questionType}
              options={["MCQ (Multiple Choice Questions)", "Structural"]}
              onSelect={(value) => {
                console.log('Selected question type:', value);
                setFormData({ ...formData, questionType: value });
              }}
              placeholder="Select the question type"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Question Text</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                focusedInput === 'questionText' && styles.inputFocused,
              ]}
              value={formData.questionText}
              onChangeText={(text) => setFormData({ ...formData, questionText: text })}
              onFocus={() => setFocusedInput('questionText')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter the question text"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {formData.questionType === 'MCQ (Multiple Choice Questions)' && (
            <View style={styles.mcqOptions}>
              <Text style={styles.sectionTitle}>MCQ Options</Text>
              {['A', 'B', 'C', 'D'].map((option) => (
                <View key={option} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Option {option}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === `option${option}` && styles.inputFocused,
                    ]}
                    value={formData[`option${option}`]}
                    onChangeText={(text) => setFormData({ ...formData, [`option${option}`]: text })}
                    onFocus={() => setFocusedInput(`option${option}`)}
                    onBlur={() => setFocusedInput(null)}
                    placeholder={`Enter option ${option}`}
                    placeholderTextColor="#999999"
                  />
                </View>
              ))}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correct Answer</Text>
                <DropdownField
                  label="Correct Answer"
                  value={formData.correctAnswer}
                  options={['A', 'B', 'C', 'D']}
                  onSelect={(value) => setFormData({ ...formData, correctAnswer: value })}
                  placeholder="Select correct answer"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Explanation (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                focusedInput === 'explanation' && styles.inputFocused,
              ]}
              value={formData.explanation}
              onChangeText={(text) => setFormData({ ...formData, explanation: text })}
              onFocus={() => setFocusedInput('explanation')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Provide an explanation"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Add Question</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerIcon: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 999999,
    elevation: 999999,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 999999,
    elevation: 999999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionsList: {
    flex: 1,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedOption: {
    backgroundColor: '#F8F8F8',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedOptionText: {
    color: '#34C759',
    fontWeight: '600',
  },
  selectedText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  mcqOptions: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddQuestionScreen;
