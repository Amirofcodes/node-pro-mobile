import api from './api';

export const getRandomArticle = async () => {
  try {
    console.log('Fetching random article...');
    console.log('API base URL:', api.defaults.baseURL);
    console.log('Request headers:', api.defaults.headers);
    const response = await api.get('/articles/random');
    console.log('Random article fetch successful. Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching random article:', error);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', JSON.stringify(error.response.headers, null, 2));
      throw new Error(error.response.data.message || 'Failed to fetch random article');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error setting up the request');
    }
  }
};

export const submitGuess = async (articleId, guessedPrice) => {
  try {
    console.log('Submitting guess:', { articleId, guessedPrice });
    console.log('API base URL:', api.defaults.baseURL);
    console.log('Request headers:', api.defaults.headers);
    const response = await api.post('/articles/guess', { articleId, guessedPrice });
    console.log('Guess submission successful. Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error submitting guess:', error);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', JSON.stringify(error.response.headers, null, 2));
      throw new Error(error.response.data.message || 'Failed to submit guess');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error setting up the request');
    }
  }
};