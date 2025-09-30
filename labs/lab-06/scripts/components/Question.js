import Options from './Options.js'
const Question = (trivia) => `
    <h3>
      Category: ${trivia.category} <br>
      Difficulty: ${trivia.difficulty}
    </h3>
    <h4>Question:</h4>
    <p>${trivia.question}</p>

    ${Options(trivia)}`;

export default Question;
