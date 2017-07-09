function resize() {
	this.style.height = 'auto';
	this.style.height = (this.scrollHeight) + 'px';
}

function updateTasksArray() {
	Array.from(document.querySelectorAll("textarea")).forEach(function(element){
		element.style.height = (element.scrollHeight) + 'px';
		element.oninput = resize;
	})
};

updateTasksArray();