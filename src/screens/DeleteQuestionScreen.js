import React, { useState } from 'react';
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

const DropdownField = ({ label, value, options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, styles.dropdownButton]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <MaterialIcons
          name={isOpen ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
          color="#34C759"
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                value === option && styles.dropdownItemSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const DeleteQuestionScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    level: '',
    subject: '',
    topic: '',
    questionType: '',
    selectedQuestion: '',
  });

  // Mock questions data - replace with actual questions from your database
  const mockQuestions = [
    "What is the derivative of x²?",
    "Explain Newton's First Law",
    "Describe the structure of an atom",
    "What caused World War II?",
  ];

  const handleDelete = () => {
    if (!formData.selectedQuestion) {
      Alert.alert('Error', 'Please select a question to delete');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this question? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Add delete logic here
            console.log('Deleting question:', formData);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

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
        <Text style={styles.title}>Delete Question</Text>
        <MaterialIcons name="delete" size={24} color="#DC3545" style={styles.headerIcon} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <DropdownField
            label="Level"
            value={formData.level}
            options={["O-Level", "A-Level"]}
            onSelect={(value) => setFormData({ ...formData, level: value })}
            placeholder="Select the exam level"
          />

          <DropdownField
            label="Subject"
            value={formData.subject}
            options={["Mathematics", "Physics", "Chemistry", "Biology", "History"]}
            onSelect={(value) => setFormData({ ...formData, subject: value })}
            placeholder="Select the subject"
          />

          <DropdownField
            label="Topic"
            value={formData.topic}
            options={["Algebra", "Newton's Laws", "Periodic Table", "Cell Structure", "World War II"]}
            onSelect={(value) => setFormData({ ...formData, topic: value })}
            placeholder="Select the topic"
          />

          <DropdownField
            label="Question Type"
            value={formData.questionType}
            options={["MCQ (Multiple Choice Questions)", "Structural"]}
            onSelect={(value) => setFormData({ ...formData, questionType: value })}
            placeholder="Select the question type"
          />

          <DropdownField
            label="Select Question"
            value={formData.selectedQuestion}
            options={mockQuestions}
            onSelect={(value) => setFormData({ ...formData, selectedQuestion: value })}
            placeholder="Select the question to delete"
          />

          <View style={styles.warningContainer}>
            <MaterialIcons name="warning" size={24} color="#DC3545" />
            <Text style={styles.warningText}>
              Warning: This action cannot be undone. Please make sure you have selected the correct question.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Delete Question</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 120 : 90,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 20,
    zIndex: 1,
  },
  headerIcon: {
    marginLeft: 8,
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    fontSize: 16,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholder: {
    color: '#999999',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    padding: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownItemSelected: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    color: '#DC3545',
    fontSize: 14,
  },
  buttonGroup: {
    marginTop: 32,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  dangerButton: {
    backgroundColor: '#DC3545',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6C757D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6C757D',
  },
});

export default DeleteQuestionScreen;
