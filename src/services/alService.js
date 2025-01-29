import { supabase } from '../config/supabase.config';

export const alService = {
  // Fetch all A/L subjects
  async getSubjects() {
    try {
      const { data, error } = await supabase
        .from('al_subjects')
        .select('*')
        .order('subject_name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching A/L subjects:', error);
      throw error;
    }
  },

  // Fetch topics for a specific subject
  async getTopics(subjectId) {
    try {
      const { data, error } = await supabase
        .from('al_topics')
        .select(`
          *,
          al_subjects (
            subject_name,
            subject_code
          )
        `)
        .eq('subject_id', subjectId)
        .order('topic_order');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching A/L topics:', error);
      throw error;
    }
  },

  // Fetch subtopics for a specific topic
  async getSubtopics(topicId) {
    try {
      const { data, error } = await supabase
        .from('al_subtopics')
        .select('*')
        .eq('topic_id', topicId)
        .order('subtopic_order');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching A/L subtopics:', error);
      throw error;
    }
  }
};
