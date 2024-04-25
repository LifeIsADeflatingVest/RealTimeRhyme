const textArea = document.getElementById('text-area');
const lastWord = document.getElementById('last-word');
const lastWordRand =  document.getElementById('last-word-random');

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
    lastWord.innerHTML = "";
  }
});

function updateLastWord() {
	const currentWords = textArea.value.trim().split(' ');
	const lastWordStr = currentWords[currentWords.length - 1] || '';
	lastWord.innerHTML = "";
  
  // Remove punctuation from the last word
	const lastWordWithoutPunctuation = lastWordStr.replace(/[^a-zA-Z]+/g, ""); 

	RiTa.rhymes(lastWordWithoutPunctuation).then(function(rhymesArray){
		if (rhymesArray.length > 6) {
			rhymesArray.length = 6;
		}
		for (let i=0;i<rhymesArray.length;i++) {
			lastWord.innerHTML += rhymesArray[i]+"<br>";
		}
		lastWordRand.innerHTML = RiTa.randomWord({ pos: "nn"}) + "<br>" + RiTa.randomWord({ pos: "nn"});
	});
}

function randFromArr(arr) {
	  const randomIndex = Math.floor(Math.random() * arr.length);
	  return arr[randomIndex];
}