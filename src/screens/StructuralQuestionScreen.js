import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { deepseekService } from '../services/deepseekService';
import { questionService } from '../services/questionService';

export default function StructuralQuestionScreen({ navigation, route }) {
  const { topic, questionType } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, [topic]);

  useEffect(() => {
    const showKeyboardTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(showKeyboardTimer);
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      console.log('Current Question:', {
        text: currentQuestion.question_text,
        model_answer: currentQuestion.model_answer || currentQuestion.solution,
        marks: currentQuestion.mark_allocation
      });
    }
  }, [currentQuestion]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      if (!topic || !topic.value) {
        throw new Error('Invalid topic selected');
      }

      const { data: questionTypeData, error: typeError } = await questionService.getQuestionTypeId('Structural');
      
      if (typeError) {
        throw typeError;
      }
      if (!questionTypeData) {
        throw new Error('Question type not found');
      }

      const { data: fetchedQuestions, error: questionsError } = await questionService.getQuestionsByTopicAndType(
        topic.value,
        questionTypeData.id,
        questionType
      );

      if (questionsError) {
        throw questionsError;
      }

      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        throw new Error('No questions found for this topic');
      }

      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(fetchedQuestions[0]);
      setUserAnswer('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load questions');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer || !userAnswer.trim()) {
      Alert.alert('Error', 'Please enter your answer before submitting.');
      return;
    }

    console.log('Submitted Answer:', userAnswer);

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await deepseekService.evaluateAnswer(
        currentQuestion.question_text,
        currentQuestion.model_answer || currentQuestion.solution,
        userAnswer,
        parseInt(currentQuestion.mark_allocation) || 20
      );

      if (result && (typeof result.score !== 'undefined')) {
        setEvaluation(result);
      } else {
        setErrorMessage('Invalid response from evaluation service. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setErrorMessage('Failed to evaluate answer. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1]);
      setUserAnswer('');
      setEvaluation(null);
      setErrorMessage(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentQuestion(questions[currentQuestionIndex - 1]);
      setUserAnswer('');
      setEvaluation(null);
      setErrorMessage(null);
    }
  };

  const handleReturn = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
    setShowImageOptions(false);
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
    setShowImageOptions(false);
  };

  const handlePlusButton = () => {
    inputRef.current?.focus();
    setShowImageOptions(true);
  };

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
          <Text style={styles.returnText}>Return</Text>
        </TouchableOpacity>

        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
          <Text style={styles.returnText}>Return</Text>
        </TouchableOpacity>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
          <Text style={styles.returnText}>Return</Text>
        </TouchableOpacity>

        <View style={styles.noQuestionsContainer}>
          <Text style={styles.noQuestionsText}>No questions found for this topic</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
        style={styles.returnButton}
        onPress={handleReturn}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
        <Text style={styles.returnText}>Return</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContent}>
          <View style={styles.questionSection}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionNumber}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <Text style={styles.markAllocation}>
                [{currentQuestion?.mark_allocation} marks]
              </Text>
              <Text style={styles.questionText}>{currentQuestion?.question_text}</Text>
            </View>
          </View>

          <ScrollView style={styles.evaluationScroll}>
            {evaluation && !isLoading && !errorMessage && (
              <View style={styles.evaluationContainer}>
                <View style={styles.evaluationHeader}>
                  <View style={styles.evaluatorIcon}>
                    <MaterialIcons name="school" size={24} color="#666" />
                  </View>
                  <Text style={styles.evaluatorTitle}>CGCE Examiner</Text>
                </View>

                <View style={styles.evaluationContent}>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>
                      {evaluation.explanation.split('.')[0]} {/* Display just the score line */}
                    </Text>
                  </View>

                  <Text style={styles.contentText}>
                    {evaluation.explanation.split('.').slice(1).join('.').trim()} {/* Rest of the explanation */}
                  </Text>

                  {evaluation.suggestions && (
                    <Text style={styles.contentText}>
                      {evaluation.suggestions}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          {!evaluation ? (
            <>
              <TextInput
                ref={inputRef}
                style={styles.answerInput}
                multiline
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Type answer and/or upload image..."
                textAlignVertical="top"
              />

              <View style={styles.inputControls}>
                <TouchableOpacity style={styles.iconButton} onPress={handlePlusButton}>
                  <MaterialIcons name="add" size={24} color="#666" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="mic" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !userAnswer.trim() && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!userAnswer.trim() || isLoading}
                >
                  <MaterialIcons 
                    name="arrow-forward" 
                    size={24} 
                    color={!userAnswer.trim() || isLoading ? '#999' : '#fff'} 
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.navigationControls}>
              <TouchableOpacity
                style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <MaterialIcons 
                  name="arrow-back" 
                  size={24} 
                  color={currentQuestionIndex === 0 ? '#999' : '#fff'} 
                />
                <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled]}
                onPress={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                <Text style={[styles.navButtonText, currentQuestionIndex === questions.length - 1 && styles.navButtonTextDisabled]}>Next</Text>
                <MaterialIcons 
                  name="arrow-forward" 
                  size={24} 
                  color={currentQuestionIndex === questions.length - 1 ? '#999' : '#fff'} 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal
          transparent
          visible={showImageOptions}
          onRequestClose={() => setShowImageOptions(false)}
          animationType="fade"
        >
          <TouchableOpacity 
            style={styles.modalContainer} 
            activeOpacity={1}
            onPress={() => setShowImageOptions(false)}
          >
            <View 
              style={[
                styles.imageOptionsContainer,
                {
                  position: 'absolute',
                  bottom: 140, 
                  left: 16, 
                }
              ]}
            >
              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => {
                  takePhoto();
                  setShowImageOptions(false); 
                  inputRef.current?.focus();
                }}
              >
                <MaterialIcons name="camera" size={24} color="#333" />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => {
                  pickImage();
                  setShowImageOptions(false); 
                  inputRef.current?.focus();
                }}
              >
                <MaterialIcons name="image" size={24} color="#333" />
                <Text style={styles.imageOptionText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f2e0',
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 40,
  },
  returnText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 4,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  questionSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  questionContainer: {
    marginBottom: 16,
  },
  evaluationScroll: {
    flex: 1,
    padding: 16,
  },
  evaluationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    padding: 8,
    minHeight: 60,
  },
  answerInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noQuestionsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  imageOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 200,
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  imageOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  evaluationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  evaluatorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  evaluatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  evaluationContent: {
    padding: 16,
  },
  scoreBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scoreText: {
    fontSize: 16,
    color: '#444',
  },
  scoreNumber: {
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2c2c2c',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#666',
    marginRight: 8,
    marginTop: 4,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  markAllocation: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    color: '#333',
  },
  inputControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  submitButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Changed from '#6200ee' to green
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
