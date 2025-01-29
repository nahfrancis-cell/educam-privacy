import { supabase } from '../config/supabase.config';

const insertStructuralQuestion = async () => {
  try {
    // Get the topic ID for Algebra in O/L Mathematics
    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select('id')
      .eq('topic_name', 'Algebra')
      .eq('subject_id', 
        supabase
          .from('subjects')
          .select('id')
          .eq('subject_name', 'Mathematics')
          .eq('level_id', 
            supabase
              .from('levels')
              .select('id')
              .eq('level', 'O/L')
              .single()
          )
          .single()
      )
      .single();

    if (topicError) {
      console.error('Error getting topic:', topicError);
      return;
    }

    // Get the question type ID for Structural
    const { data: questionTypeData, error: questionTypeError } = await supabase
      .from('question_types')
      .select('id')
      .eq('type_name', 'Structural')
      .single();

    if (questionTypeError) {
      console.error('Error getting question type:', questionTypeError);
      return;
    }

    // Insert the structural question
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .insert([
        {
          question_text: 'Show all steps to solve the quadratic equation: x² + 5x + 6 = 0',
          topic_id: topicData.id,
          question_type_id: questionTypeData.id,
          year: 2024,
          marks: 5
        }
      ])
      .select();

    if (questionError) {
      console.error('Error inserting question:', questionError);
      return;
    }

    console.log('Successfully inserted structural question:', questionData);

  } catch (error) {
    console.error('Error:', error);
  }
};

export default insertStructuralQuestion;
