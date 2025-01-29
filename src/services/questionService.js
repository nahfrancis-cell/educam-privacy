import { supabase } from '../config/supabase.config';

export const questionService = {
  getQuestionTypeId: async (typeName) => {
    try {
      console.log('Getting question type ID for:', typeName);
      const { data, error } = await supabase
        .from('question_types')
        .select('id, type_name')
        .ilike('type_name', `%${typeName}%`)
        .single();

      console.log('Question type query result:', { data, error });

      if (error) {
        console.error('Error in getQuestionTypeId:', error);
        throw error;
      }

      // If no matching type found, default to ID 1 for structural questions
      if (!data && typeName.toLowerCase() === 'structural') {
        console.log('No question type found, defaulting to ID 1 for structural');
        return { data: { id: 1 }, error: null };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getQuestionTypeId:', error);
      return { data: null, error };
    }
  },

  getQuestionsByTopicAndType: async (topicId, questionTypeId, questionType) => {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        console.log('Fetching questions with:', { topicId, questionTypeId, questionType });
        
        if (questionType === 'Structural') {
          console.log('Building structural questions query...');
          
          if (!topicId) {
            console.error('Missing topicId');
            throw new Error('Topic ID is required');
          }

          const actualQuestionTypeId = 1;
          
          console.log('Querying structural_questions with:', {
            topic_id: topicId,
            question_type_id: actualQuestionTypeId
          });

          const { data, error } = await supabase
            .from('structural_questions')
            .select(`
              id,
              question,
              topic_id,
              question_type_id,
              explanation,
              solution,
              diagram,
              mark_allocation,
              level_id,
              subject_id
            `)
            .eq('topic_id', topicId)
            .eq('question_type_id', actualQuestionTypeId);

          if (error) throw error;
          
          // Transform the data to match the expected format in the UI
          const transformedData = data.map(question => ({
            id: question.id,
            question_text: question.question,
            answer: question.solution,
            explanation: question.explanation,
            solution: question.solution,
            topic_id: question.topic_id,
            question_type_id: question.question_type_id,
            diagram: question.diagram,
            mark_allocation: question.mark_allocation
          }));

          console.log('Transformed structural questions:', transformedData);
          return { data: transformedData, error: null };
        } else {
          console.log('Building MCQ questions query...');
          
          const { data, error } = await supabase
            .from('mcq_questions')
            .select(`
              id,
              question_text,
              topic_id,
              question_type_id,
              option_a,
              option_b,
              option_c,
              option_d,
              correct_answer,
              explanation,
              solution
            `)
            .eq('topic_id', topicId)
            .eq('question_type_id', questionTypeId);

          if (error) throw error;
          console.log('Fetched MCQ questions:', data);
          return { data, error: null };
        }
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount === maxRetries) {
          console.error('Max retries reached. Returning error.');
          return { 
            data: null, 
            error: new Error(`Failed to fetch questions after ${maxRetries} attempts: ${error.message}`) 
          };
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
  }
};
