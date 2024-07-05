const fs = require('fs');

//Clean a word by removing non-letter characters and converting to lowercase
function cleanWord(word) {
  return word.replace(/[^a-zA-Z]/g, '').toLowerCase();
}

const wordFrequency = {};

//Read text from file
const data = fs.readFileSync('input.txt', 'utf8');
const lines = data.split('\n');

for (const line of lines) {
  const words = line.split(' ').filter(word => word !== '');
  
  for (const word of words) {
    const cleanedWord = cleanWord(word);
    if (cleanedWord) {
      if (wordFrequency[cleanedWord]) {
        wordFrequency[cleanedWord]++;
      } else {
        wordFrequency[cleanedWord] = 1;
      }
    }
  }
}

//Display word frequencies
console.log('Word Frequencies:');
for (const [word, frequency] of Object.entries(wordFrequency)) {
  console.log(`${word}: ${frequency}`);
}
