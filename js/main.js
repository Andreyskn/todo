var visibleTaskList = document.getElementsByClassName('show')[0].firstElementChild;

// клонирование первой строки

document.body.addEventListener("click", function(){
	if (event.target.classList.contains("addTask")) {
		event.preventDefault();
		newTask();
		window.scrollTo(0,document.body.scrollHeight);
	}
});

document.body.addEventListener("dragstart", function(){
	if (event.target.classList.contains("nodrag")) {
		event.preventDefault();
	}
});

 function newTask() {
 	var cloneTask = visibleTaskList.firstElementChild.cloneNode(true);
 	cloneTask.removeAttribute("class");
 	visibleTaskList.appendChild(cloneTask);
 	visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].value = ''; //очистка инпута
 	visibleTaskList.lastElementChild.querySelectorAll("input")[1].checked = false; // сброс чекбокса
 	visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].classList.remove("redline");
 	visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].focus();
 	visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].style.height = 'auto';
 	updateTasksArray();
 };

// удаление строки

document.body.addEventListener("click", function(){
	if (event.target.classList.contains("close")) {
		event.preventDefault();
		deleteTask();
	}
});

function deleteTask() {
  	if (event.target.parentNode == event.target.parentNode.parentNode.getElementsByTagName('li')[0] && event.target.parentNode.parentNode.children.length == 1) {
  		visibleTaskList.firstElementChild.querySelectorAll("textarea")[0].value = '';
  		visibleTaskList.firstElementChild.querySelectorAll("input")[1].checked = false;
  		visibleTaskList.firstElementChild.querySelectorAll("textarea")[0].classList.remove("redline");
  		visibleTaskList.firstElementChild.querySelectorAll("textarea")[0].style.height = 'auto';
  	} 
  	else {
    	event.target.parentNode.remove();
    }
    updateTasksArray();
};

// новая строка по нажатию Enter, перемещение по строкам

document.body.addEventListener("keydown", function(event) {
	if (event.keyCode == 13) {event.preventDefault();};
	// проверка является ли активным последний инпут при нажатии Enter
	if (visibleTaskList.lastElementChild.querySelectorAll("textarea")[0] === document.activeElement && event.keyCode == 13) {
		newTask();
	};
	// проверка является ли активным любой из инпутов кроме последнего при нажатии Enter или стрелка Вниз (конвертация NodeList в  Array)
	if (Array.from(visibleTaskList.querySelectorAll("textarea")).some(elem => elem === document.activeElement) && visibleTaskList.lastElementChild.querySelectorAll("textarea")[0] !== document.activeElement && (event.keyCode == 13 || event.keyCode == 40)) {	
		if (document.activeElement.selectionStart == document.activeElement.value.length) {
			nextTask();
		}
		else {
			return false;
		}
	};
	if (Array.from(visibleTaskList.querySelectorAll("textarea")).some(elem => elem === document.activeElement) && visibleTaskList.firstElementChild.querySelectorAll("textarea")[0] !== document.activeElement && event.keyCode == 38) {
		if (document.activeElement.selectionStart == 0) {
			previousTask();
		}
		else {
			return false;
		}
	};
});

// удаление последней строки по нажатию Backspace

document.body.addEventListener("keydown", function(event) {
	if (visibleTaskList.lastElementChild.querySelectorAll("textarea")[0] === document.activeElement && visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].value === '' && event.keyCode == 8) {
		deleteTask();
	}
});

// переключение фокуса на следующее текстовое поле

function nextTask() {
	var inputsArray = visibleTaskList.querySelectorAll("textarea");
	for (i = 0; i < inputsArray.length; i++) {
		if (inputsArray[i] === document.activeElement) {
			var activeInput = i;
		}
	} 
	inputsArray[activeInput+1].focus();
	// установка курсора в конец строки (вариант 1)
	inputsArray[activeInput+1].selectionStart = inputsArray[activeInput+1].selectionEnd = inputsArray[activeInput+1].value.length;
};

// переключение фокуса на предыдущее текстовое поле

function previousTask() {
	var inputsArray = visibleTaskList.querySelectorAll("textarea");
	for (i = 0; i < inputsArray.length; i++) {
		if (inputsArray[i] === document.activeElement) {
			var activeInput = i;
		}
	}
	inputsArray[activeInput-1].focus();
	// установка курсора в конец строки (вариант 2)
	setTimeout(function(){inputsArray[activeInput-1].setSelectionRange(inputsArray[activeInput-1].value.length, inputsArray[activeInput-1].value.length)}, 0);
};

// переключение вкладок

Tabs.addEventListener("click", function() {
	if (Array.from(Tabs.getElementsByClassName("closeTab")).some(elem => elem === event.target)) {
		deleteTab();
	} else if (event.target.parentNode.classList.contains('active')) {
		activeTabClick();
	} else {
		switchTab();
	}
});

function switchTab() {
	var prevActiveTab, prevActiveTabNumber, switchDirection;
	if (event.target.parentNode.id === "addTab" || event.target.tagName.toUpperCase() !== 'A') {
		return false;
	} else {
		prevActiveTab = document.getElementsByClassName('active')[0];
		prevActiveTabNumber = parseInt(prevActiveTab.id.match(/\d+/g), 10);
		prevActiveTab.firstElementChild.firstElementChild.classList.add('noclick');
		prevActiveTab.removeAttribute("class");
		event.target.parentNode.classList.add("active");
		event.target.firstElementChild.classList.remove("noclick");
	};
	var activeTabNumber = parseInt(event.target.parentNode.id.match(/\d+/g), 10);

	if (activeTabNumber > prevActiveTabNumber) {
		switchDirection = 'right';
	} else {
		switchDirection = 'left';
	}

	showTasks(activeTabNumber, true, switchDirection);
	// фокус на пустое поле нужно сделать через промис или убрать совсем
	// if (visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].value == '') {
	// 	visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].focus();
	// }
	updateTasksArray();
};

// показ инпутов соответствующих активной вкладке 

function showTasks(activeTabNumber, switching, switchDirection) {
	switching = switching || false;
	var tabContentArray = document.getElementsByClassName('tabContent');
	var prevTabContent = document.getElementsByClassName('show')[0];
	if (switching) {
		tabContentArray[activeTabNumber - 1].classList.add("show");
		if (switchDirection == 'right') {
			tabContentArray[activeTabNumber - 1].children[0].classList.add("transition");
			tabContentArray[activeTabNumber - 1].children[1].classList.add("transition");
			tabContentArray[activeTabNumber - 1].children[2].classList.add("transition");		
			tabContentArray[activeTabNumber - 1].children[0].classList.add("slide-from-right");
			tabContentArray[activeTabNumber - 1].children[1].classList.add("slide-from-right");
			tabContentArray[activeTabNumber - 1].children[2].classList.add("slide-from-right");			
			prevTabContent.children[0].classList.add("transition-init-pos");
			prevTabContent.children[1].classList.add("transition-init-pos");
			prevTabContent.children[2].classList.add("transition-init-pos");
			setTimeout(function(){
				prevTabContent.children[0].classList.add("slide-to-left");
				prevTabContent.children[1].classList.add("slide-to-left");
				prevTabContent.children[2].classList.add("slide-to-left");
				tabContentArray[activeTabNumber - 1].children[0].classList.add("slide-in");
				tabContentArray[activeTabNumber - 1].children[1].classList.add("slide-in");
				tabContentArray[activeTabNumber - 1].children[2].classList.add("slide-in");
			}, 0);
			setTimeout(function(){
				tabContentArray[activeTabNumber - 1].children[0].classList.remove("transition", "slide-from-right", "slide-in");
				tabContentArray[activeTabNumber - 1].children[1].classList.remove("transition", "slide-from-right", "slide-in");
				tabContentArray[activeTabNumber - 1].children[2].classList.remove("transition", "slide-from-right", "slide-in");
				prevTabContent.children[0].classList.remove("transition-init-pos", "slide-to-left");
				prevTabContent.children[1].classList.remove("transition-init-pos", "slide-to-left");
				prevTabContent.children[2].classList.remove("transition-init-pos", "slide-to-left");
				prevTabContent.classList.remove("show");
			}, 200);
		} else {
			tabContentArray[activeTabNumber - 1].children[0].classList.add("transition");
			tabContentArray[activeTabNumber - 1].children[1].classList.add("transition");	
			tabContentArray[activeTabNumber - 1].children[2].classList.add("transition");		
			tabContentArray[activeTabNumber - 1].children[0].classList.add("slide-from-left");
			tabContentArray[activeTabNumber - 1].children[1].classList.add("slide-from-left");
			tabContentArray[activeTabNumber - 1].children[2].classList.add("slide-from-left");			
			prevTabContent.children[0].classList.add("transition-init-pos");
			prevTabContent.children[1].classList.add("transition-init-pos");
			prevTabContent.children[2].classList.add("transition-init-pos");
			setTimeout(function(){
				prevTabContent.children[0].classList.add("slide-to-right");
				prevTabContent.children[1].classList.add("slide-to-right");
				prevTabContent.children[2].classList.add("slide-to-right");
				tabContentArray[activeTabNumber - 1].children[0].classList.add("slide-in");
				tabContentArray[activeTabNumber - 1].children[1].classList.add("slide-in");
				tabContentArray[activeTabNumber - 1].children[2].classList.add("slide-in");
			}, 0);
			setTimeout(function(){
				tabContentArray[activeTabNumber - 1].children[0].classList.remove("transition", "slide-from-left", "slide-in");
				tabContentArray[activeTabNumber - 1].children[1].classList.remove("transition", "slide-from-left", "slide-in");
				tabContentArray[activeTabNumber - 1].children[2].classList.remove("transition", "slide-from-left", "slide-in");
				prevTabContent.children[0].classList.remove("transition-init-pos", "slide-to-right");
				prevTabContent.children[1].classList.remove("transition-init-pos", "slide-to-right");
				prevTabContent.children[2].classList.remove("transition-init-pos", "slide-to-right");
				prevTabContent.classList.remove("show");
			}, 200);
		}
		visibleTaskList = tabContentArray[activeTabNumber - 1].children[0];
	} else {		
		for (i=0; i < tabContentArray.length; i++) {
			tabContentArray[i].classList.remove("show");	
		};
		tabContentArray[activeTabNumber - 1].classList.add("show");
		visibleTaskList = document.getElementsByClassName('show')[0].firstElementChild;
		return visibleTaskList;
	}
	return visibleTaskList;
};

//добавление новой вкладки

addTab.addEventListener("click", newTab);

function newTab() {
	var cloneTab = Tabs.firstElementChild.cloneNode(true);
	cloneTab.id = 'Tab[' + parseInt(Tabs.getElementsByTagName('li').length, 10) + ']';
	cloneTab.getElementsByTagName('input')[0].setAttribute('placeholder', 'New tab');
	cloneTab.removeAttribute("class");
	Tabs.insertBefore(cloneTab, addTab);
	var tablinks = Tabs.getElementsByTagName('li');
	for (i = 0; i < tablinks.length - 2; i++) {
		tablinks[i].removeAttribute("class");
		tablinks[i].firstElementChild.firstElementChild.classList.add("noclick");
	}
	tablinks[tablinks.length - 2].classList.add("active");
	tablinks[tablinks.length - 2].firstElementChild.firstElementChild.classList.remove("noclick");
	tablinks[tablinks.length - 2].firstElementChild.firstElementChild.value = '';
	tablinks[tablinks.length - 2].firstElementChild.firstElementChild.focus();


	var cloneTabContent = document.body.getElementsByClassName('tabContent')[0].cloneNode(true);
	cloneTabContent.classList.remove("show");
	form.appendChild(cloneTabContent);

	// удаление всех инпутов, кроме первого
	
	var lastTabContentTasks = document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].getElementsByTagName('li');
	var j = lastTabContentTasks.length - 1;
	while (j > 0) {
		lastTabContentTasks[j].remove();
		j--;
	}
	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelectorAll("textarea")[0].value = ''; //очистка инпута
	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelectorAll("textarea")[0].style.height = 'auto';
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelectorAll("input")[1].checked = false; // сброс чекбокса
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelectorAll("textarea")[0].classList.remove("redline");
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelector("[class=refresh]").checked = false;
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelector("[type=time]").value = "03:00";
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelector("[type=time]").setAttribute("disabled","disabled");
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelector("[type=time]").style.width = "auto";
 	document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].querySelector("[type=time]").style.opacity = ".3"
 	renameInputs();
	var activeTabNumber = parseInt(tablinks[tablinks.length - 2].id.match(/\d+/g), 10);
	showTasks(activeTabNumber);

	var tabNamesArray = Tabs.querySelectorAll("input[type=text]");
	adjust(tabNamesArray, 1, 100, 300);
	updateTasksArray();
	setTasksDragging();
};

// удаление вкладки

function deleteTab() {
	var tablinks = Tabs.getElementsByTagName('li');
	for (i = 0; i < tablinks.length; i++) {
		if (tablinks[i] == event.target.parentNode.parentNode && tablinks.length > 2) {
			// если удаляемая вкладка активна и является последней в ряду, активной становится предпоследняя
			if (tablinks[i].classList.contains('active') && i == tablinks.length - 2) {
				tablinks[i-1].classList.add('active');		
			}
			// если удаляемая вкладка активна и не является последней, активной становится следующая
			if (tablinks[i].classList.contains('active') && i >= 0 && i < tablinks.length - 2) {
				tablinks[i+1].classList.add('active');		
			} 
			// удаляем вкладку и ее контент
			document.body.getElementsByClassName('tabContent')[i].remove();
			tablinks[i].remove();
			// переименовываем все вкладки по порядку
			for (j = 0; j < tablinks.length - 1; j++) {
				tablinks[j].id = 'Tab[' + (j + 1) + ']';
			}
			// находим activeTabNumber
			for (i = 0; i < tablinks.length; i++) {
				if (tablinks[i].classList.contains('active')) {
					var activeTabNumber = i + 1;
				}
			}
			showTasks(activeTabNumber);
			if (visibleTaskList.lastElementChild.querySelectorAll("textarea")[0] == '') {
				visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].focus();
			}
		}
		//  действия при удалении единственной вкладки
		if (tablinks[i] == event.target.parentNode.parentNode && tablinks.length == 2) {
			var lastTabContentTasks = document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1].getElementsByTagName('li');
			var j = lastTabContentTasks.length - 1;
			while (j > 0) {
				lastTabContentTasks[j].remove();
				j--;
			}
			visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].value = '';
			visibleTaskList.lastElementChild.querySelectorAll("input")[1].checked = false;
			visibleTaskList.lastElementChild.querySelectorAll("textarea")[0].classList.remove("redline");
			Tabs.getElementsByTagName("input")[0].classList.remove("noclick");
			Tabs.getElementsByTagName("input")[0].value = '';
			Tabs.getElementsByTagName("input")[0].setAttribute('placeholder', 'Tasks');
			Tabs.getElementsByTagName("input")[0].focus();
		}
	}
	renameInputs();
	var tabNamesArray = Tabs.querySelectorAll("input[type=text]");
	adjust(tabNamesArray, 1, 100, 300);
	updateTasksArray();
};

// установка атрибута name всех инпутов соответственно номеру вкладки

function renameInputs() {
	var tabContentArray = document.getElementsByClassName('tabContent');
	for (i=0; i < tabContentArray.length; i++) {
		var textInputArray = tabContentArray[i].querySelectorAll("textarea");
		var checkboxArray = tabContentArray[i].querySelectorAll("input[type=checkbox]");
		var hiddenInputArray = tabContentArray[i].querySelectorAll("input[type=hidden]");
		var refreshLabel = tabContentArray[i].querySelectorAll("label")[0];
		var refreshCheckbox = tabContentArray[i].querySelectorAll("input[class=refresh]")[0];
		var refreshTime = tabContentArray[i].querySelectorAll("input[type=time]")[0];
		for (j=0; j < textInputArray.length; j++) {
			textInputArray[j].name = "Task[" + (parseInt(i, 10) + 1) + "][]";
		};
		for (k=0; k < hiddenInputArray.length; k++) {
			hiddenInputArray[k].name = "checkbox[" + (parseInt(i, 10) + 1) + "][]";
		};
		for (n=0; n < checkboxArray.length; n++) {
			checkboxArray[n].name = "checkbox[" + (parseInt(i, 10) + 1) + "][]";
		};
		refreshLabel.setAttribute("for","daily[" + (parseInt(i, 10) + 1) + "]");
		refreshCheckbox.name = "daily[" + (parseInt(i, 10) + 1) + "]";
		refreshCheckbox.id = "daily[" + (parseInt(i, 10) + 1) + "]";
		refreshTime.name = "time[" + (parseInt(i, 10) + 1) + "]";
	};
}


function activeTabClick() {
	event.target.firstElementChild.classList.remove("noclick");
	event.target.firstElementChild.focus();
}

// перечеркивание инпута

document.body.addEventListener("click", function(){
	if (event.target.type == 'checkbox' && event.target.className != 'refresh') {
		strikeOut();
	}
});

function strikeOut() {
	if (event.target.checked == false) {
		event.target.parentNode.getElementsByTagName('textarea')[0].classList.remove("redline");
	} else {
		event.target.parentNode.getElementsByTagName('textarea')[0].classList.add("redline");
	};
};

// set refresh time

form.addEventListener("click", function(){
	if (event.target.type == 'checkbox' && event.target.className == 'refresh') {
		if (event.target.parentNode.querySelector("[type=time]").hasAttribute("disabled")) {
			event.target.parentNode.querySelector("[type=time]").removeAttribute("disabled");
		} else {
			event.target.parentNode.querySelector("[type=time]").setAttribute("disabled", "disabled");
		}
	}
});



// изменение размера поля ввода названия вкладки в зависимости от длины содержимого

function adjust(elements, offset, min, max) {

    // определение аргументов функции
    offset = offset || 0;
    min    = min    || 0;
    max    = max    || Infinity;

    var measureArray = Array.from(document.body.getElementsByClassName('measure'));
    for (i=0; i < measureArray.length; i++) {
    	measureArray[i].remove();
    }

    elements.forEach(function(element) {
    	
        // добавление нового элемента для определения длины содержимого
	    var id = btoa(Math.floor(Math.random() * Math.pow(2, 64))); //генерация уникального id
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = '<span id="' + id + '">' + element.value + '</span>';
        div.setAttribute('class', 'measure');
        div.style.visibility = 'hidden';
        div.style.position = 'absolute';
        div.getElementsByTagName('span')[0].style.fontSize = window.getComputedStyle(element, null).fontSize;
        
        // регулировка длины исходного элемента по нажатию клавиш
        function update() {

            // задержка, чтобы браузер добавил значение нажатой клавиши
            setTimeout(function() {

                // предотвращение схлапывания пробелов в тексте
                div.getElementsByTagName('span')[0].innerHTML = element.value.replace(/ /g, '&nbsp');

                // определение нужной длины исходного элемента и предотвращение скролинга
                var size = Math.max(min, Math.min(max, div.getElementsByTagName('span')[0].offsetWidth + offset));
                if (size < max) {
	            element.scrollLeft = 0;
	            };
                // применение новой длины к исходному элементу
                element.style.width = size + 'px';
            }, 0);
        };
        update();
        element.onkeydown = update;
    });
};

// установка значения value = placeholder всем пустым инпутам в названиях вкладок

function setTabNames() {
	var tabNamesArray = Tabs.querySelectorAll("input[type=text]");
	for (i=0; i < tabNamesArray.length; i++) {
		if (tabNamesArray[i].value == '') {
			tabNamesArray[i].value = tabNamesArray[i].getAttribute("placeholder");
		}
	}
}

// вызов функции перед отправкой формы
form.addEventListener("submit", setTabNames);

// вызов функции при загрузке страницы
adjust(Array.from(Tabs.getElementsByClassName('tabName')), 1, 100, 304);

(function () {
	var allCheckboxes = document.body.querySelectorAll("input[type=checkbox]");
	for (i=0; i < allCheckboxes.length; i++) {
		if (allCheckboxes[i].getAttribute("checked") == "checked" && allCheckboxes[i].className != "refresh") {
			allCheckboxes[i].parentNode.getElementsByTagName('textarea')[0].classList.add("redline");
		}
	};
})();

var drake = dragula([document.querySelector('#Tabs')], {
	invalid: function (el, handle) {
	  return el.id === 'addTab';
	},
	accepts: function (el, target, source, sibling) {
		if (sibling === null) {
			return false;
		} else {
			return true;
		}
	},
	direction: 'horizontal'
});

var tabInitPos, tabNewPos;

drake.on('drag', function(el){
	tabInitPos = parseInt(el.id.match(/\d+/g), 10);
});

drake.on('dragend', function(el){
	var tablinks = Tabs.getElementsByTagName('li');
	for (j = 0; j < tablinks.length - 1; j++) {
		tablinks[j].id = 'Tab[' + (j + 1) + ']';
	}
	tabNewPos = parseInt(el.id.match(/\d+/g), 10);
	renameTasksOnDrag();
});

function renameTasksOnDrag(){
	var tabContent = form.getElementsByClassName('tabContent');
	var initCheckboxName = tabContent[tabInitPos-1].querySelectorAll('[name*="checkbox"]');
	var initTaskName = tabContent[tabInitPos-1].querySelectorAll('[name*="Task"]');
	for (j = 0; j < initCheckboxName.length; j++) {
		initCheckboxName[j].name = "checkbox[" + tabNewPos + "][]";
	}
	for (n = 0; n < initTaskName.length; n++) {
		initTaskName[n].name = "Task[" + tabNewPos + "][]";
	}
	if (tabInitPos > tabNewPos) {
		for (i = tabNewPos - 1; i < tabInitPos - 1; i++) {
			var checkbox = tabContent[i].querySelectorAll('[name*="checkbox"]');
			for (j = 0; j < checkbox.length; j++) {
				var checkboxName = checkbox[j].name;
				checkbox[j].name = "checkbox[" + (parseInt(checkboxName.match(/\d+/g), 10) + 1) + "][]";
			}
			var task = tabContent[i].querySelectorAll('[name*="Task"]');
			for (n = 0; n < task.length; n++) {
				var taskName = task[n].name;
				task[n].name = "Task[" + (parseInt(taskName.match(/\d+/g), 10) + 1) + "][]";
			}
		}
		form.insertBefore(tabContent[tabInitPos-1], tabContent[tabNewPos-1]);
	}
	if (tabInitPos < tabNewPos) {
		for (i = tabInitPos; i < tabNewPos; i++) {
			var checkbox = tabContent[i].querySelectorAll('[name*="checkbox"]');
			for (j = 0; j < checkbox.length; j++) {
				var checkboxName = checkbox[j].name;
				checkbox[j].name = "checkbox[" + (parseInt(checkboxName.match(/\d+/g), 10) - 1) + "][]";
			}
			var task = tabContent[i].querySelectorAll('[name*="Task"]');
			for (n = 0; n < task.length; n++) {
				var taskName = task[n].name;
				task[n].name = "Task[" + (parseInt(taskName.match(/\d+/g), 10) - 1) + "][]";
			}
		}
		form.insertBefore(tabContent[tabInitPos-1], tabContent[tabNewPos]);
	}
	
};

function setTasksDragging() {
	var taskList = document.querySelectorAll('.tabContent>ol');
	for (i=0; i < taskList.length; i++) {
		new Slip(taskList[i]);

		taskList[i].addEventListener('slip:beforeswipe', function(e) {
		    e.preventDefault(); // won't move sideways if prevented
		});

		taskList[i].addEventListener('slip:beforewait', function(e) {
			// if prevented element will be dragged (instead of page scrolling)	    
			if (e.target.classList.contains("drag")){
			    e.preventDefault();
			} else {
				return false;
			}
		});

		taskList[i].addEventListener('slip:beforereorder', function(e) {
	        e.target.classList.remove('icon-hand-paper-o');
	        e.target.classList.add('icon-hand-grab-o');
	        form.style.cursor = 'none';
	        e.target.parentNode.style.cursor = 'none';
	        Array.from(e.target.parentNode.children).forEach(function(child){
	        	child.style.cursor = 'none';
	        });
	    });

		taskList[i].addEventListener('slip:reorder', function(e) {
		    // e.target list item reordered.
		    e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
		    e.target.querySelector('span[class*="drag"]').classList.remove('icon-hand-grab-o');
		    e.target.querySelector('span[class*="drag"]').classList.add('icon-hand-paper-o');
		    form.style.removeProperty('cursor');
		    e.target.style.removeProperty('cursor');
	    	Array.from(e.target.children).forEach(function(child){
		    	child.style.removeProperty('cursor');
		    });
		});
	};
};

setTasksDragging();