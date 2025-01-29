import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { questionService } from '../services/questionService';

export default function MCQQuestionScreen({ navigation, route }) {
  const { topic, questionType } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  useEffect(() => {
    if (!topic || !topic.value) {
      setError('No topic selected');
      setIsLoading(false);
      return;
    }
    fetchQuestions();
  }, [topic?.value]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!topic || !topic.value) {
        throw new Error('Invalid topic selected');
      }

      const { data: questionTypeData, error: typeError } = await questionService.getQuestionTypeId('MCQ');
      
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
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setShowExplanation(false);
      setShowSolution(false);
      setAnsweredQuestions({});
    } catch (error) {
      setError(error.message || 'Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowCorrectAnswer(true);
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: true
    }));
  };

  const getAnswerText = (letter) => {
    if (!questions[currentQuestionIndex]) return '';
    switch(letter) {
      case 'A': return questions[currentQuestionIndex].option_a;
      case 'B': return questions[currentQuestionIndex].option_b;
      case 'C': return questions[currentQuestionIndex].option_c;
      case 'D': return questions[currentQuestionIndex].option_d;
      default: return '';
    }
  };

  const isCorrectAnswer = (optionLetter) => {
    if (!questions[currentQuestionIndex]) return false;
    const correctAnswer = questions[currentQuestionIndex].correct_answer?.trim();
    
    // If correct_answer is a single letter (A, B, C, D), compare letters
    if (/^[A-D]$/.test(correctAnswer)) {
      return optionLetter === correctAnswer;
    }
    
    // Otherwise compare the actual text
    const optionText = getAnswerText(optionLetter)?.trim();
    return optionText === correctAnswer;
  };

  const renderOptionIcon = (option) => {
    if (!showCorrectAnswer || !questions[currentQuestionIndex]) return null;
    
    if (isCorrectAnswer(option)) {
      return <MaterialIcons name="check-circle" size={20} color="#4CAF50" />;
    }

    if (option === selectedAnswer && !isCorrectAnswer(option)) {
      return <MaterialIcons name="cancel" size={20} color="#FF5252" />;
    }

    return null;
  };

  const renderOption = (optionLetter) => {
    if (!questions[currentQuestionIndex]) return null;
    
    const isCorrect = isCorrectAnswer(optionLetter);
    const isSelected = optionLetter === selectedAnswer;

    const optionStyle = [
      styles.optionContainer,
      showCorrectAnswer && isCorrect && styles.correctAnswer,
      showCorrectAnswer && isSelected && !isCorrect && styles.wrongAnswer
    ];

    return (
      <TouchableOpacity
        key={optionLetter}
        style={optionStyle}
        onPress={() => handleAnswerSelect(optionLetter)}
        disabled={showCorrectAnswer}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionRow}>
            <View style={[
              styles.radioOuter,
              showCorrectAnswer && isCorrect && styles.radioOuterCorrect,
              showCorrectAnswer && isSelected && !isCorrect && styles.radioOuterWrong
            ]}>
              {(isSelected || (showCorrectAnswer && isCorrect)) && (
                <View style={[
                  styles.radioInner,
                  showCorrectAnswer && isCorrect && styles.radioInnerCorrect,
                  showCorrectAnswer && isSelected && !isCorrect && styles.radioInnerWrong
                ]} />
              )}
            </View>
            <Text style={styles.optionLetter}>{optionLetter}.</Text>
            <Text style={styles.optionText}>{getAnswerText(optionLetter)}</Text>
          </View>
          {renderOptionIcon(optionLetter)}
        </View>
      </TouchableOpacity>
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setShowExplanation(false);
      setShowSolution(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setShowExplanation(false);
      setShowSolution(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
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
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchQuestions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
          <Text style={styles.questionText}>{questions[currentQuestionIndex]?.question_text}</Text>

          <View style={styles.optionsContainer}>
            {renderOption('A')}
            {renderOption('B')}
            {renderOption('C')}
            {renderOption('D')}
          </View>

          {showExplanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationText}>{questions[currentQuestionIndex]?.explanation}</Text>
            </View>
          )}

          {showSolution && (
            <View style={styles.solutionContainer}>
              <Text style={styles.solutionText}>
                {questions[currentQuestionIndex]?.solution}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedAnswer && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled
            ]}
            onPress={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={20} 
              color={currentQuestionIndex === 0 ? '#999' : '#fff'} 
            />
            <Text style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled
            ]}>Previous</Text>
          </TouchableOpacity>

          <View style={styles.centerButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setShowExplanation(!showExplanation)}
            >
              <Text style={styles.navButtonText}>Explanation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setShowSolution(!showSolution)}
            >
              <Text style={styles.navButtonText}>Solution</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled
            ]}
            onPress={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <Text style={[
              styles.navButtonText,
              currentQuestionIndex === questions.length - 1 && styles.navButtonTextDisabled
            ]}>Next</Text>
            <MaterialIcons 
              name="arrow-forward" 
              size={20} 
              color={currentQuestionIndex === questions.length - 1 ? '#999' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f2e0',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  returnText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  questionNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  optionRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#757575',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterCorrect: {
    borderColor: '#4CAF50',
  },
  radioOuterWrong: {
    borderColor: '#FF5252',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioInnerCorrect: {
    backgroundColor: '#4CAF50',
  },
  radioInnerWrong: {
    backgroundColor: '#FF5252',
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    color: '#333',
    width: 25,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  correctAnswer: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  wrongAnswer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 80,
    maxWidth: 100,
    justifyContent: 'center',
    marginHorizontal: 2,
    minHeight: 36,
  },
  navButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  centerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  solutionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  solutionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
