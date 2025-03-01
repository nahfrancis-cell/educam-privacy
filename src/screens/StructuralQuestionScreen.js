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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { deepseekService } from '../services/deepseekService';
import { questionService } from '../services/questionService';
import { supabase } from '../config/supabase.config';

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

      // First, filter questions that have diagram field
      const questionsWithDiagrams = fetchedQuestions.filter(q => q.diagram);
      
      // Get all diagram paths
      const diagramPaths = questionsWithDiagrams.map(q => q.diagram);
      
      try {
        // Get all public URLs in one request
        const { data: urls } = await supabase
          .storage
          .from('question-images')
          .createSignedUrls(diagramPaths, 3600); // URLs valid for 1 hour

        // Create a map of diagram names to their URLs
        const urlMap = {};
        urls?.forEach(item => {
          if (item.signedUrl) {
            const pathParts = item.path.split('/');
            const filename = pathParts[pathParts.length - 1];
            urlMap[filename] = item.signedUrl;
          }
        });

        // Map the URLs back to questions
        const questionsWithImages = fetchedQuestions.map(question => {
          if (question.diagram && urlMap[question.diagram]) {
            return { ...question, imageUrl: urlMap[question.diagram] };
          }
          return { ...question, imageUrl: null };
        });

        setQuestions(questionsWithImages);
        setCurrentQuestionIndex(0);
        setCurrentQuestion(questionsWithImages[0]);
        setUserAnswer('');
      } catch (error) {
        console.error('Error fetching images:', error);
        setQuestions(fetchedQuestions.map(q => ({ ...q, imageUrl: null })));
        setCurrentQuestionIndex(0);
        setCurrentQuestion(fetchedQuestions[0]);
        setUserAnswer('');
      }
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.noQuestionsContainer}>
          <Text style={styles.noQuestionsText}>No questions found for this topic</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 40}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={handleReturn}
        >
        </TouchableOpacity>

        <View style={styles.container}>
          <ScrollView 
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.mainContent}>
              {!evaluation && (
                <View style={styles.questionSection}>
                  <View style={styles.questionContainer}>
                    <Text style={styles.questionNumber}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </Text>
                    <Text style={styles.markAllocation}>
                      [{currentQuestion?.mark_allocation} marks]
                    </Text>
                    <Text style={styles.questionText}>{currentQuestion?.question_text}</Text>
                    {currentQuestion?.diagram && currentQuestion?.imageUrl && (
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: currentQuestion.imageUrl }}
                          style={styles.questionImage}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}

              <ScrollView style={styles.evaluationScroll}>
                {evaluation && (
                  <>
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
                            {evaluation.explanation.split('.')[0]}
                          </Text>
                        </View>

                        <Text style={styles.contentText}>
                          {evaluation.explanation.split('.').slice(1).join('.').trim()}
                        </Text>

                        {evaluation.suggestions && (
                          <Text style={styles.contentText}>
                            {evaluation.suggestions}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.navigationControls}>
                      <TouchableOpacity
                        style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
                        onPress={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                      >
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
                  </>
                )}
              </ScrollView>
            </View>
          </ScrollView>

          {!evaluation && (
            <View style={styles.inputSection}>
              <View style={styles.unifiedInputContainer}>
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
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f2e0',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 0,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  questionSection: {
    backgroundColor: '#fff',
    marginTop: 20,
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
  unifiedInputContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    padding: 8,
  },
  answerInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#f8f9fa',
  },
  inputControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 8,
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
    backgroundColor: '#fff',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', 
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
  imageContainer: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  questionImage: {
    width: '100%',
    height: '100%',
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,  
    paddingLeft: 16,
    paddingBottom: 20,
  },
});
