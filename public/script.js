function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

	// Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;

	window.speechSynthesis.speak(speech);
}

recognition.onresult = function (event) {
	var current = event.resultIndex;
	var transcript = event.results[current][0].transcript;
	noteContent += transcript;
	noteTextarea.val(noteContent);
};

// $("#pause-record-btn").on("click", function (e) {
// 	recognition.stop();
// });

// $("#/start-record-btn").on("click", function (e) {
recognition.start();
// });

// var mobileRepeatBug =
// 	current == 1 && transcript == event.results[0][0].transcript;

// if (!mobileRepeatBug) {
// 	noteContent += transcript;
// 	noteTextarea.val(noteContent);
// }

function doubleClick(x) {
	console.log(x);
	x.removeAttribute("readonly");
	x.style.border = "1px solid aqua";
}

function sendData(target) {
	target.setAttribute("readonly", "");
	target.style.border = "none";
	fetch(`/update/${target.id}`, {
		method: "POST",
		body: JSON.stringify({ title: target.value }),
		headers: new Headers({ "Content-Type": "application/json" }),
	});
}
