import { supabase } from '../config/supabase.config';

export const roleService = {
  async isAdmin(userId) {
    try {
      console.log('Checking admin status for userId:', userId);
      
      // Check admin status from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        return false;
      }

      console.log('Profile data from database:', profileData);

      // Use the direct database value
      if (profileData && profileData.is_admin === true) {
        console.log('User is admin based on database value');
        return true;
      }

      console.log('User is not admin based on database value');
      return false;
    } catch (error) {
      console.error('Error in isAdmin:', error);
      return false;
    }
  }
};
