import testData from './testData';
import insertStructuralQuestion from './insertStructuralQuestion';

const runTests = async () => {
  console.log('Inserting structural question...');
  await insertStructuralQuestion();
  
  console.log('\nFetching all questions...');
  await testData();
};

runTests();
