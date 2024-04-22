const textArea = document.getElementById('text-area');
const lastWord = document.getElementById('last-word');

let previousValue = "";
let timeoutId = null; // Variable to store timeout ID

textArea.addEventListener('keyup', (event) => {
  // Clear any previous timeout
  clearTimeout(timeoutId);

  // Set a timeout to detect user stop typing
  timeoutId = setTimeout(() => {
    updateLastWord();
  }, 500); // timeout duration

  // Check if user stopped typing or used punctuation
  if (!event.key || event.key.match(/^[^a-zA-Z]+$/)) {
    updateLastWord();
  } else {
    // Clear the last word if key is not space or punctuation
    lastWord.textContent = "";
  }
});

function updateLastWord() {
	const currentWords = textArea.value.trim().split(' ');
	const lastWordStr = currentWords[currentWords.length - 1] || '';

  // Remove punctuation from the last word
	const lastWordWithoutPunctuation = lastWordStr.replace(/[^a-zA-Z]+/g, ""); 

	RiTa.rhymes(lastWordWithoutPunctuation).then(function(rhymesArray){
		lastWord.textContent = randFromArr(rhymesArray);
	});
}

function randFromArr(arr) {
	  const randomIndex = Math.floor(Math.random() * arr.length);
	  return arr[randomIndex];
}