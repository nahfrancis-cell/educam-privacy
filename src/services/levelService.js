import { supabase } from '../config/supabase.config';

export const levelService = {
  async getLevels() {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching levels:', error);
      return { data: null, error };
    }
  }
};
