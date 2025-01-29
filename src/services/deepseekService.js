import axios from 'axios';

const DEEPSEEK_API_KEY = 'sk-b6bc2492a98b4eefa9d7c05aa9c2b334';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const deepseekService = {
  evaluateAnswer: async (question, correctAnswer, userAnswer, markAllocation) => {
    try {
      console.log('Sending evaluation request with:', {
        question,
        correctAnswer,
        userAnswer,
        markAllocation
      });

      if (!question || !correctAnswer || !userAnswer || !markAllocation) {
        console.error('Missing required parameters:', {
          hasQuestion: !!question,
          hasCorrectAnswer: !!correctAnswer,
          hasUserAnswer: !!userAnswer,
          hasMarkAllocation: !!markAllocation
        });
        throw new Error('Missing required parameters for evaluation');
      }

      const prompt = `As a CGCE examiner, evaluate this answer in a direct way:

Question: ${question}
Model Answer: ${correctAnswer}
Student's Answer: ${userAnswer}
Maximum Marks: ${markAllocation}

Important: Do not use any asterisks (*) or stars in your response.

Provide feedback in this format:
1. Start with the score: "You've earned X out of ${markAllocation} marks."
2. Give a direct explanation of what was good and what was missing
3. Explain the correct answer naturally as part of the feedback
4. Keep the answer length proportional to the marks

Example:
"You've earned 3 out of 5 marks. Your explanation of photosynthesis was good, but you didn't mention the role of chlorophyll. Here's the complete answer: Light energy is captured by chlorophyll in chloroplasts and used to convert carbon dioxide and water into glucose, releasing oxygen as a byproduct.

(a) Culture vs. culture medium: A culture refers to the growth of microorganisms, while a culture medium is the nutrient solution used to support their growth. Batch vs. continuous culture: Batch culture is a closed system where nutrients are added at the start and no further additions are made, while continuous culture involves continuously adding fresh medium and removing used medium to maintain a steady state.

(b) Exploiting microbes: For antibiotics, Penicillium produces penicillin through fermentation, including strain selection, fermentation conditions, and downstream processing. For beer production, yeast ferments sugars to produce alcohol and flavor compounds under controlled conditions."`;

      console.log('Making API request to:', DEEPSEEK_API_URL);
      
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          messages: [
            {
              role: "system",
              content: "You are a CGCE examiner providing direct feedback. Never use asterisks or stars in your responses. Format text normally without any special characters or markdown."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 800,
          stream: false,
          model: "deepseek-chat",
          presence_penalty: 0,
          frequency_penalty: 0,
          timeout: 15000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          }
        }
      );

      console.log('API Response:', response.data); // Add response logging

      console.log('Received API response:', response.data);

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        console.error('Invalid API response format:', response.data);
        throw new Error('Invalid response format from API');
      }

      const feedback = response.data.choices[0].message.content;
      
      // Extract score from feedback (assuming it's in the format "You've earned X out of Y marks")
      const scoreMatch = feedback.match(/earned (\d+) out of/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

      // Split feedback into explanation and suggestions
      const [explanation, ...suggestions] = feedback.split('\n\n');

      return {
        score,
        explanation: explanation.trim(),
        suggestions: suggestions.join('\n\n').trim()
      };

    } catch (error) {
      console.error('API Error:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error details:', error.config);
      }
      throw new Error(`DeepSeek API Error: ${error.message}`);
    }
  }
};
