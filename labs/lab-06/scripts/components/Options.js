const BooleanOptions = () => (
    `<div>
        <button onclick = "checkAnswer('True')"> True</button>
        <button onclick = "checkAnswer('False')"> False</button>
    </div>
    `
)

const escapeQuotes = (str) => str.replace(/'/g, "\\'").replace(/"/g, '&quot;');

const MultiOptions = (trivia) => {
  const options = [trivia.correct_answer, ...trivia.incorrect_answers]

  return `
    <div>
      <button onclick="checkAnswer('${escapeQuotes(options[0])}')">${options[0]}</button>
      <button onclick="checkAnswer('${escapeQuotes(options[1])}')">${options[1]}</button>
      <button onclick="checkAnswer('${escapeQuotes(options[2])}')">${options[2]}</button>
      <button onclick="checkAnswer('${escapeQuotes(options[3])}')">${options[3]}</button>
    </div>
  `;
};


const Options = (trivia) => {
    switch(trivia.type) {
        case "boolean": return BooleanOptions(trivia);
        case "multiple": return MultiOptions(trivia);
    }
}
export default Options;