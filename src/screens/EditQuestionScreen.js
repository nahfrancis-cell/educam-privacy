import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  Animated,
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

const EditQuestionScreen = ({ navigation }) => {
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

  const handleSave = () => {
    // Add save logic here
    console.log('Saving question:', formData);
    navigation.goBack();
  };

  const renderMCQOptions = () => {
    if (formData.questionType !== 'MCQ (Multiple Choice Questions)') return null;

    return (
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
        <DropdownField
          label="Correct Answer"
          value={formData.correctAnswer}
          options={['A', 'B', 'C', 'D']}
          onSelect={(value) => setFormData({ ...formData, correctAnswer: value })}
          placeholder="Select correct answer"
        />
      </View>
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
        <Text style={styles.title}>Edit Question</Text>
        <MaterialIcons name="edit" size={24} color="#34C759" style={styles.headerIcon} />
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

          {renderMCQOptions()}

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

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
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
  inputFocused: {
    borderColor: '#34C759',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
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
  mcqOptions: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  buttonGroup: {
    marginTop: 32,
    gap: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#34C759',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#34C759',
  },
});

export default EditQuestionScreen;
