import { supabase } from '../config/supabase.config';

export const adminService = {
  uploadQuestionImage: async (file, subjectId, topicId, questionId, questionType) => {
    try {
      // Create file path using the structure: subjectID/topicID/questionID-image.jpg
      const filePath = `${subjectId}/${topicId}/${questionId}-image.jpg`;
      
      // Upload the image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('question-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // This will replace the file if it already exists
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl }, error: urlError } = await supabase.storage
        .from('question-images')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        throw urlError;
      }

      // Update the question record with the image path
      const tableName = questionType === 'MCQ' ? 'mcq_questions' : 'structural_questions';
      const { data: updateData, error: updateError } = await supabase
        .from(tableName)
        .update({ image_path: filePath })
        .eq('id', questionId)
        .single();

      if (updateError) {
        console.error('Error updating question with image path:', updateError);
        throw updateError;
      }

      return { filePath, publicUrl };
    } catch (error) {
      console.error('Error in uploadQuestionImage:', error);
      throw error;
    }
  },

  deleteQuestionImage: async (questionId, questionType) => {
    try {
      // First get the question to find the image path
      const tableName = questionType === 'MCQ' ? 'mcq_questions' : 'structural_questions';
      const { data: question, error: questionError } = await supabase
        .from(tableName)
        .select('image_path')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;
      if (!question?.image_path) return { message: 'No image to delete' };

      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from('question-images')
        .remove([question.image_path]);

      if (deleteError) throw deleteError;

      // Clear the image path from the question
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ image_path: null })
        .eq('id', questionId);

      if (updateError) throw updateError;

      return { message: 'Image deleted successfully' };
    } catch (error) {
      console.error('Error in deleteQuestionImage:', error);
      throw error;
    }
  }
};
