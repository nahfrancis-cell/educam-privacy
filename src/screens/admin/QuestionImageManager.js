import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { adminService } from '../../services/adminService';
import { questionService } from '../../services/questionService';

export default function QuestionImageManager({ route, navigation }) {
  const { questionId, questionType, subjectId, topicId } = route.params;
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchQuestionDetails();
  }, [questionId]);

  const fetchQuestionDetails = async () => {
    try {
      const tableName = questionType === 'MCQ' ? 'mcq_questions' : 'structural_questions';
      const { data, error } = await questionService.getQuestionById(questionId, tableName);
      if (error) throw error;
      setQuestion(data);
      if (data.image_path) {
        const { data: { publicUrl } } = await adminService.getQuestionImagePublicUrl(data.image_path);
        setImagePreview(publicUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load question details');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        const asset = result.assets[0];
        setImagePreview(asset.uri);
        uploadImage(asset);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  const uploadImage = async (imageAsset) => {
    try {
      setUploading(true);
      
      // Convert URI to Blob
      const response = await fetch(imageAsset.uri);
      const blob = await response.blob();

      const { filePath, publicUrl } = await adminService.uploadQuestionImage(
        blob,
        subjectId,
        topicId,
        questionId,
        questionType
      );

      setImagePreview(publicUrl);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async () => {
    try {
      setUploading(true);
      await adminService.deleteQuestionImage(questionId, questionType);
      setImagePreview(null);
      Alert.alert('Success', 'Image deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteImage, style: 'destructive' }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.returnButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
            <Text style={styles.returnText}>Return</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.questionText}>
            {questionType === 'MCQ' ? question?.question_text : question?.question}
          </Text>
          
          {imagePreview ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imagePreview }}
                style={styles.questionImage}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]}
                onPress={confirmDelete}
                disabled={uploading}
              >
                <MaterialIcons name="delete" size={24} color="white" />
                <Text style={styles.buttonText}>Delete Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.uploadButton]}
              onPress={pickImage}
              disabled={uploading}
            >
              <MaterialIcons name="add-photo-alternate" size={24} color="white" />
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f0',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
  },
  content: {
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});
