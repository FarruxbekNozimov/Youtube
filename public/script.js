function doubleClick(x) {
	fetch("/delete/courses", {
		method: "POST",
		body: JSON.stringify({ hi: "hello" }), // convert Js object to a string
		headers: new Headers({ "Content-Type": "application/json" }), // add headers
	});
}
