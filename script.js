const textArea = document.getElementById('text-area');
const lastWord = document.getElementById('last-word');
const lastWordRand =  document.getElementById('last-word-random');
const lastWordAllit =  document.getElementById('last-word-alliteration');
const lastWordStress = document.getElementById('last-word-stress');
const lastWordSyn = document.getElementById("last-word-syn");
const theFlow = document.getElementById("flow");
let lastWordWithoutPunctuation = "";
let elementCnt = 0;

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
  }
});

document.getElementById("stressButton").addEventListener("click", function(){
	lastWordStress.innerHTML = "";
	let pattern = document.getElementById("thePattern").value;
	
	//metering patterns
	datamuse(lastWordWithoutPunctuation, false).then(function(res){
		for (let i=0;i<res.length;i++) {
			if (RiTa.stresses(res[i].word)==pattern) {
				lastWordStress.innerHTML += res[i].word + ", ";
			}
		}
		copyElements(lastWordStress);		
	});
});

document.getElementById("synButton").addEventListener("click", function(){
	lastWordSyn.innerHTML = "";
	
	//synonyms
	datamuse(lastWordWithoutPunctuation, true).then(function(res){
		for (let i=0;i<res.length;i++) {
			lastWordSyn.innerHTML += res[i].word + ", ";
		}
		copyElements(lastWordSyn);
	});

});

function updateLastWord() {
	copyElements(lastWord);
	copyElements(lastWordAllit);
		
	const currentWords = textArea.value.trim().split(' ');
	const lastWordStr = currentWords[currentWords.length - 1] || '';
	lastWord.innerHTML = "";
	lastWordAllit.innerHTML = "";
	lastWordWithoutPunctuation = lastWordStr.replace(/[^a-zA-Z]+/g, ""); // Remove punctuation from the last word

	// random adjective, noun, and verb
	lastWordRand.innerHTML = RiTa.randomWord({pos: "jj"}) + " " + RiTa.randomWord({ pos: "nns"}) + " " + RiTa.randomWord({ pos: "vb"});
	
	//rhymes
	RiTa.rhymes(lastWordWithoutPunctuation).then(function(rhymesArray){
		if (rhymesArray.length > 6) {
			rhymesArray.length = 6;
		}
		for (let i=0;i<rhymesArray.length;i++) {
			lastWord.innerHTML += rhymesArray[i]+", ";
		}
	});
	
	//alliteration
	RiTa.alliterations(lastWordWithoutPunctuation, { maxLength: 4, limit:5, pos:"a" }).then(function(alliterationsArray){
		for (let i=0;i<alliterationsArray.length;i++) {
			lastWordAllit.innerHTML += alliterationsArray[i]+", ";
		}
	})
}

function copyElements(origEl) {
	$("#flowHeight").html($('#flow').prop('scrollHeight'));
	if (origEl.innerHTML != "") {
		const copiedElement = origEl.cloneNode(true);
		copiedElement.id = "copy"+elementCnt;
		theFlow.appendChild(copiedElement);
		elementCnt++;
		//
		var textCounts = {};
		$('#flow p').each(function() {
			var text = $(this).text().trim();
			textCounts[text] = (textCounts[text] || 0) + 1;
			if (textCounts[text] > 1) {
				$(this).css('display', 'none');
			}
		});
		//
	}
	theFlow.scrollTop = theFlow.scrollHeight;
	if ($('#flow').prop('scrollHeight') > 3000) {
		$("#flow").html("");
	}
}

function datamuse(word, synonym) {
	if (synonym) {
		url = "https://api.datamuse.com/words?ml="+word+"&max=10";
	}
	else {
		url = 'https://api.datamuse.com/words?rel_trg='+word;
	}
    return new Promise(function(resolve, reject) {
        $.get(url)
            .done(data => resolve(data))
            .fail(error => reject(error));
    });
}

function randFromArr(arr) {
	  const randomIndex = Math.floor(Math.random() * arr.length);
	  return arr[randomIndex];
}

function clearFields() {
	lastWordSyn.innerHTML = "";
	lastWordStress.innerHTML = "";
	lastWordAllit.innerHTML = "";
	lastWordRand.innerHTML = "";
	lastWord.innerHTML = "";
	$("#flow").html("");
}