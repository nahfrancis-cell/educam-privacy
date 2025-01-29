import { supabase } from '../config/supabase.config';

export const subjectService = {
  async getSubjectsByLevel(levelId) {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          id,
          subject_name,
          level_id,
          levels!inner (
            id,
            level
          )
        `)
        .eq('level_id', levelId)
        .order('subject_name', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return { data: null, error };
    }
  }
};
