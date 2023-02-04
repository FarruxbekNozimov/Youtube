function stopDefault(event) {
	event.preventDefault();
	event.stopPropagation();
}
function dragOver(label, text) {
	/* ADD ALMOST ANY STYLING YOU LIKE */
	label.style.animationName = "dropbox";
	label.innerText = text;
}
function dragLeave(label) {
	const len = label.style.length;
	for (const i = 0; i < len; i++) {
		label.style[label.style[i]] = "";
	}
	label.innerText = "Click to choose imagesor drag - n - drop them here";
}
function addFilesAndSubmit(event) {
	const files = event.target.files || event.dataTransfer.files;
	document.getElementById("filesfld").files = files;
	submitFilesForm(document.getElementById("filesfrm"));
}
function submitFilesForm(form) {
	const label = document.getElementById("fileslbl");
	dragOver(label, "Uploading images..."); // set the drop zone text and styling
	const fd = new FormData();
	for (const i = 0; i < form.filesfld.files.length; i++) {
		const field = form.filesfld;
		fd.append(field.name, field.files[i], field.files[i].name);
	}
	const progress = document.getElementById("progress");
	const x = new XMLHttpRequest();
	if (x.upload) {
		x.upload.addEventListener("progress", function (event) {
			const percentage = parseInt((event.loaded / event.total) * 100);
			progress.innerText = progress.style.width = percentage + "%";
		});
	}
	x.onreadystatechange = function () {
		if (x.readyState == 4) {
			progress.innerText = progress.style.width = "";
			form.filesfld.value = "";
			dragLeave(label);
			{
				const images = JSON.parse(x.responseText);
				for (const i = 0; i < images.length; i++) {
					const img = document.createElement("img");
					img.src = images[i];
					document.body.appendChild(img);
				}
			}
		} else {
			console.log("ERROR");
		}
	};
	x.open("post", form.action, true);
	x.send(fd);
	return false;
}
