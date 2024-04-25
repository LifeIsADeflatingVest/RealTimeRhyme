const textArea = document.getElementById('text-area');
const lastWord = document.getElementById('last-word');
const lastWordRand =  document.getElementById('last-word-random');
const lastWordAllit =  document.getElementById('last-word-alliteration');

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
	lastWordAllit.innerHTML = "";
  }
});

function updateLastWord() {
	const currentWords = textArea.value.trim().split(' ');
	const lastWordStr = currentWords[currentWords.length - 1] || '';
	lastWord.innerHTML = "";
	lastWordAllit.innerHTML = "";
  
  // Remove punctuation from the last word
	const lastWordWithoutPunctuation = lastWordStr.replace(/[^a-zA-Z]+/g, ""); 

	RiTa.rhymes(lastWordWithoutPunctuation).then(function(rhymesArray){
		if (rhymesArray.length > 6) {
			rhymesArray.length = 6;
		}
		for (let i=0;i<rhymesArray.length;i++) {
			lastWord.innerHTML += rhymesArray[i]+"<br>";
		}
		RiTa.alliterations(lastWordWithoutPunctuation, { maxLength: 4, limit:5 }).then(function(alliterationsArray){
			for (let i=0;i<alliterationsArray.length;i++) {
				lastWordAllit.innerHTML += alliterationsArray[i]+"<br>";
			}
		})
		lastWordRand.innerHTML = RiTa.randomWord({ pos: "nn"}) + "<br>" + RiTa.randomWord({ pos: "vb"});
	});
}

function randFromArr(arr) {
	  const randomIndex = Math.floor(Math.random() * arr.length);
	  return arr[randomIndex];
}