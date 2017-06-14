form.addEventListener("submit", function() {
	event.preventDefault();
	var formData = new FormData(document.forms.form);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "save.php");
	xhr.send(formData);
	xhr.onload = function () {
  		save.innerHTML = "Done";
  		save.classList.remove("btn-danger");
  		save.classList.add("btn-success");
  		setTimeout(function() {
  			save.innerHTML = "Save";
  			save.classList.remove("btn-success");
  			save.classList.add("btn-danger");
  		}, 500);
	};
});