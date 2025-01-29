import { supabase } from '../config/supabase.config';

const testData = async () => {
  try {
    // Test structural questions
    const { data: structuralQuestions, error: structuralError } = await supabase
      .from('questions')
      .select(`
        *,
        topics (
          topic_name,
          subjects (
            subject_name,
            levels (
              level
            )
          )
        )
      `)
      .eq('question_type_id', 
        supabase
          .from('question_types')
          .select('id')
          .eq('type_name', 'Structural')
          .single()
      );

    if (structuralError) {
      console.error('Error fetching structural questions:', structuralError);
      return;
    }

    console.log('Structural Questions:', structuralQuestions);

  } catch (error) {
    console.error('Error:', error);
  }
};

export default testData;
