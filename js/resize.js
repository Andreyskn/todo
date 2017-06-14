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




// function removeScrollBar() {
//     document.body.style.marginRight = 0;
//     if (document.body.scrollHeight > window.innerHeight) {
//     		scrollw = window.innerWidth - document.body.clientWidth;
//     		document.body.style.marginRight = '-' + scrollw + 'px';
//     }
// }

// removeScrollBar();