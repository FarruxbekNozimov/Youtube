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
