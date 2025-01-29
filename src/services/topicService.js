import { supabase } from '../config/supabase.config';

export const topicService = {
  async getTopicsBySubject(subjectId) {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .order('topic_name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching topics:', error);
      return { data: null, error };
    }
  },

  async getQuestionTypes() {
    try {
      const { data, error } = await supabase
        .from('question_types')
        .select('*')
        .order('id');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching question types:', error);
      return { data: null, error };
    }
  }
};
