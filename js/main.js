var visibleTaskList = document.getElementsByClassName('show')[0].querySelector('ol');

// клонирование первой строки

document.body.addEventListener("click", function(){
	if (event.target.classList.contains("addTask")) {
		event.preventDefault();
		newTask();
    if (getDistanceFromTop(event.target) > (window.innerHeight + window.scrollY)) {
      window.scroll(0, getDistanceFromTop(event.target) - window.innerHeight);
    }
	}
});

function getDistanceFromTop(element) {
    var yPos = element.offsetHeight + 25;  // 25 - margin-bottom

    while(element) {
        yPos += (element.offsetTop);
        element = element.offsetParent;
    }

    return yPos;
}

document.body.addEventListener("dragstart", function(){
	if (event.target.classList.contains("nodrag")) {
		event.preventDefault();
	}
});

 function newTask() {
 	var cloneTask = visibleTaskList.firstElementChild.cloneNode(true);
 	cloneTask.removeAttribute("style");
 	visibleTaskList.appendChild(cloneTask);
 	visibleTaskList.lastElementChild.removeAttribute('class');
 	visibleTaskList.lastElementChild.querySelector("textarea").value = ''; //очистка инпута
 	visibleTaskList.lastElementChild.querySelectorAll("input")[1].checked = false; // сброс чекбокса
 	visibleTaskList.lastElementChild.querySelector("textarea").classList.remove("redline");
 	visibleTaskList.lastElementChild.querySelector("textarea").focus();
 	visibleTaskList.lastElementChild.querySelector("textarea").style.height = 'auto';

 	if (visibleTaskList.parentNode.querySelector('ol[class*="complete"]')) {
  		var start = visibleTaskList.getElementsByTagName('li').length - visibleTaskList.querySelectorAll('[class*="redline"]').length + 1;
  		visibleTaskList.parentNode.querySelector('ol[class*="complete"]').setAttribute('start', start);
  	}

 	updateTasksArray();
 }

// удаление строки

document.body.addEventListener("click", function(){
	if (event.target.classList.contains("close")) {
		event.preventDefault();
		deleteTask();
	}
});

function deleteTask() {
	if (event.target.parentNode == visibleTaskList.querySelector('li:not([class])') && visibleTaskList.querySelectorAll('li:not([class])').length == 1) {
  		event.target.parentNode.querySelector("textarea").value = '';
  		event.target.parentNode.querySelectorAll("input")[1].checked = false;
  		event.target.parentNode.querySelector("textarea").classList.remove("redline");
  		event.target.parentNode.querySelector("textarea").style.height = 'auto';
  	} 
  	else {
  		if (visibleTaskList.parentNode.querySelector('ol[class*="complete"]')) {
	  		var start = visibleTaskList.getElementsByTagName('li').length - visibleTaskList.querySelectorAll('[class*="redline"]').length;
	  		visibleTaskList.parentNode.querySelector('ol[class*="complete"]').setAttribute('start', (event.target.parentNode.parentNode.classList.contains('complete')?start+1:start));
	  		if (event.target.parentNode.hasAttribute('class') && visibleTaskList.children.length > 1) {
	  			var cloneClass = event.target.parentNode.className;
	  			visibleTaskList.querySelector('[class="'+cloneClass+'"').remove();
	  		}
	  		if (event.target.parentNode.parentNode.classList.contains("complete") && visibleTaskList.children.length == 1) {
	  			event.target.parentNode.remove();
	  			visibleTaskList.querySelector('li').removeAttribute('class');
	  			visibleTaskList.querySelector('li').removeAttribute('style');
	  			visibleTaskList.querySelector("textarea").value = '';
		  		visibleTaskList.querySelectorAll("input")[1].checked = false;
		  		visibleTaskList.querySelector("textarea").classList.remove("redline");
		  		visibleTaskList.querySelector("textarea").style.height = 'auto';
	  		}
	  	}
    	event.target.parentNode.remove();
    }
    updateTasksArray();
}

// новая строка по нажатию Enter, перемещение по строкам

document.body.addEventListener("keydown", function(event) {
	if (event.keyCode == 13) {event.preventDefault();}
	// проверка является ли активным последний инпут при нажатии Enter
	if (visibleTaskList.querySelectorAll('li')[Array.from(visibleTaskList.querySelectorAll('li'))
      .indexOf(visibleTaskList.querySelectorAll('li:not([class])')
        [visibleTaskList.querySelectorAll('li:not([class])').length-1])]
      		.querySelector("textarea") === document.activeElement && event.keyCode == 13) 
  {
		newTask();
    if (getDistanceFromTop(visibleTaskList.parentNode.querySelector('[class*=addTask]')) > (window.innerHeight + window.scrollY)) {
      window.scroll(0, getDistanceFromTop(visibleTaskList.parentNode.querySelector('[class*=addTask]')) - window.innerHeight);
    }
	}
	// проверка является ли активным любой из инпутов кроме последнего при нажатии Enter или стрелка Вниз (конвертация NodeList в  Array)
	if (Array.from(visibleTaskList.querySelectorAll("textarea")).some(elem => elem === document.activeElement) && visibleTaskList.lastElementChild.querySelectorAll("textarea")[0] !== document.activeElement && (event.keyCode == 13 || event.keyCode == 40)) {	
		if (document.activeElement.selectionStart == document.activeElement.value.length) {
			nextTask();
		}
		else {
			return false;
		}
	}
	if (Array.from(visibleTaskList.querySelectorAll("textarea")).some(elem => elem === document.activeElement) && visibleTaskList.firstElementChild.querySelectorAll("textarea")[0] !== document.activeElement && event.keyCode == 38) {
		if (document.activeElement.selectionStart == 0) {
			previousTask();
		}
		else {
			return false;
		}
	}
});

// удаление последней строки по нажатию Backspace

document.body.addEventListener("keydown", function(event) {
  var NoClassTasksLength = visibleTaskList.querySelectorAll('li:not([class])').length;
  var lastTaskNoClass = visibleTaskList.querySelectorAll('li:not([class])')[NoClassTasksLength - 1].querySelector('textarea');
  if (lastTaskNoClass === document.activeElement && lastTaskNoClass.value === '' && event.keyCode == 8) {
    deleteTask();
    NoClassTasksLength = visibleTaskList.querySelectorAll('li:not([class])').length;
    lastTaskNoClass = visibleTaskList.querySelectorAll('li:not([class])')[NoClassTasksLength - 1].querySelector('textarea');
    lastTaskNoClass.focus();
	}
});

// переключение фокуса на следующее текстовое поле

function nextTask() {
  var NoClassTasksArray = visibleTaskList.querySelectorAll('li:not([class])');
  var activeInput;
	for (i = 0; i < NoClassTasksArray.length; i++) {
		if (NoClassTasksArray[i].querySelector('textarea') === document.activeElement) {
			activeInput = i;
		}
	} 
  if (NoClassTasksArray[activeInput+1]) {
  	NoClassTasksArray[activeInput+1].querySelector('textarea').focus();
  	// установка курсора в конец строки (вариант 1)
  	NoClassTasksArray[activeInput+1].querySelector('textarea').selectionStart = 
    NoClassTasksArray[activeInput+1].querySelector('textarea').selectionEnd = 
    NoClassTasksArray[activeInput+1].querySelector('textarea').value.length;
  }
}

// переключение фокуса на предыдущее текстовое поле

function previousTask() {
  var NoClassTasksArray = visibleTaskList.querySelectorAll('li:not([class])');
  var activeInput;
  for (i = 0; i < NoClassTasksArray.length; i++) {
    if (NoClassTasksArray[i].querySelector('textarea') === document.activeElement) {
      activeInput = i;
    }
  } 
  if (NoClassTasksArray[activeInput-1]) {
	  NoClassTasksArray[activeInput-1].querySelector('textarea').focus();
		// установка курсора в конец строки (вариант 2)
	  setTimeout(function(){
	    NoClassTasksArray[activeInput-1].querySelector('textarea')
	      .setSelectionRange(NoClassTasksArray[activeInput-1].querySelector('textarea').value.length, 
	        NoClassTasksArray[activeInput-1].querySelector('textarea').value.length);
	  }, 0);	
	}
}

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
	}
	var activeTabNumber = parseInt(event.target.parentNode.id.match(/\d+/g), 10);

	if (activeTabNumber > prevActiveTabNumber) {
		switchDirection = 'right';
	} else {
		switchDirection = 'left';
	}

	showTasks(activeTabNumber, true, switchDirection);
	updateTasksArray();
}

// показ инпутов соответствующих активной вкладке 

function showTasks(activeTabNumber, switching, switchDirection) {
	switching = switching || false;
	var tabContentArray = document.getElementsByClassName('tabContent');
	var prevTabContent = document.getElementsByClassName('show')[0];
	if (switching) {
		tabContentArray[activeTabNumber - 1].classList.add("show");
		Array.from(tabContentArray[activeTabNumber - 1].children).forEach(e => e.classList.add("transition",(switchDirection == 'right' ? "slide-from-right":"slide-from-left")));
		Array.from(prevTabContent.children).forEach(e=>e.classList.add("transition-init-pos"));
		setTimeout(function(){
			Array.from(prevTabContent.children).forEach(e=>e.classList.add((switchDirection == 'right' ? "slide-to-left":"slide-to-right")));
			Array.from(tabContentArray[activeTabNumber - 1].children).forEach(e=>e.classList.add("slide-in"));
		}, 0);
		setTimeout(function(){
			Array.from(tabContentArray[activeTabNumber - 1].children).forEach(e=>e.classList.remove("transition", "slide-from-right", "slide-from-left", "slide-in"));
			Array.from(prevTabContent.children).forEach(e=>e.classList.remove("transition-init-pos", "slide-to-left", "slide-to-right"));
			prevTabContent.classList.remove("show");
		}, 200);
		visibleTaskList = tabContentArray[activeTabNumber - 1].querySelector('ol');
	} else {		
		for (i=0; i < tabContentArray.length; i++) {
			tabContentArray[i].classList.remove("show");	
		}
		tabContentArray[activeTabNumber - 1].classList.add("show");
		visibleTaskList = document.getElementsByClassName('show')[0].querySelector('ol');
		return visibleTaskList;
	}
	return visibleTaskList;
}

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
	cloneTabContent.querySelector('li').removeAttribute('class');
	cloneTabContent.querySelector('li').removeAttribute('style');
	form.appendChild(cloneTabContent);

	// удаление всех инпутов, кроме первого
	var lastTabContent = document.body.getElementsByClassName('tabContent')[document.body.getElementsByClassName('tabContent').length-1];
	var lastTabContentTasks = lastTabContent.getElementsByTagName('li');
	var j = lastTabContentTasks.length - 1;
	while (j > 0) {
		lastTabContentTasks[j].remove();
		j--;
	}

	lastTabContent.querySelector('ol[class*="complete"]').remove();

  	lastTabContent.querySelector('ol').classList.add('list-unstyled');
	lastTabContent.querySelector("input[name*=list-styler]").value = 0;
	lastTabContent.querySelector("input[name*=list-sorter]").value = 0;
	lastTabContent.querySelector("button[class*=list-sorter]").classList.remove('icon-up-outline', 'icon-down-outline');
	lastTabContent.querySelector("button[class*=list-sorter]").classList.add('icon-down-outline');
	lastTabContent.querySelector("textarea").innerHTML = ''; //очистка инпута
  	lastTabContent.querySelector("textarea").value = '';
	lastTabContent.querySelector("textarea").style.height = 'auto';
 	lastTabContent.querySelector("input[type=checkbox]").checked = false; // сброс чекбокса
 	lastTabContent.querySelector("textarea").classList.remove("redline");
 	lastTabContent.querySelector("[class=refresh]").checked = false;
 	lastTabContent.querySelector("[type=time]").value = "03:00";
 	lastTabContent.querySelector("[type=time]").setAttribute("disabled","disabled");
 	// lastTabContent.querySelector("[type=time]").style.width = "auto";
 	// lastTabContent.querySelector("[type=time]").style.opacity = ".3";
 	renameInputs();
	var activeTabNumber = parseInt(tablinks[tablinks.length - 2].id.match(/\d+/g), 10);
	showTasks(activeTabNumber);
	var tabNamesArray = Tabs.querySelectorAll("input[type=text]");
	adjust(tabNamesArray, 1, 100, 300);
	updateTasksArray();
	setTasksDragging();
	var listener = function(){
		if (event.keyCode == 13) {
			visibleTaskList.querySelector('textarea').focus();
		}
	};
	tablinks[tablinks.length - 2].querySelector('input').addEventListener("keyup", listener);
	
	tablinks[tablinks.length - 2].querySelector('input').addEventListener("keydown", function(){
		if (event.keyCode == 13) {
			setTimeout(function(){
				tablinks[tablinks.length - 2].querySelector('input').removeEventListener("keyup", listener);
			}, 2000);
		}
	});	
}

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
			var activeTabNumber;
			for (i = 0; i < tablinks.length; i++) {
				if (tablinks[i].classList.contains('active')) {
					activeTabNumber = i + 1;
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
			var n = lastTabContentTasks.length - 1;
			while (n > 0) {
				lastTabContentTasks[n].remove();
				n--;
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
}

// установка атрибута name всех инпутов соответственно номеру вкладки

function renameInputs() {
	var tabContentArray = document.getElementsByClassName('tabContent');
	for (i=0; i < tabContentArray.length; i++) {
		var textInputArray = tabContentArray[i].querySelectorAll("textarea");
		var checkboxArray = tabContentArray[i].querySelectorAll("input[type=checkbox]");
		var hiddenInputArray = tabContentArray[i].querySelectorAll("input[type=hidden][name*=checkbox]");
		var refreshLabel = tabContentArray[i].querySelectorAll("label")[0];
		var refreshCheckbox = tabContentArray[i].querySelectorAll("input[class=refresh]")[0];
		var refreshTime = tabContentArray[i].querySelectorAll("input[type=time]")[0];
		for (j=0; j < textInputArray.length; j++) {
			textInputArray[j].name = "Task[" + (parseInt(i, 10) + 1) + "][]";
		}
		for (k=0; k < hiddenInputArray.length; k++) {
			hiddenInputArray[k].name = "checkbox[" + (parseInt(i, 10) + 1) + "][]";
		}
		for (n=0; n < checkboxArray.length; n++) {
			checkboxArray[n].name = "checkbox[" + (parseInt(i, 10) + 1) + "][]";
		}
		refreshLabel.setAttribute("for","daily[" + (parseInt(i, 10) + 1) + "]");
		refreshCheckbox.name = "daily[" + (parseInt(i, 10) + 1) + "]";
		refreshCheckbox.id = "daily[" + (parseInt(i, 10) + 1) + "]";
		refreshTime.name = "time[" + (parseInt(i, 10) + 1) + "]";
	}
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
	var start;
	if (event.target.checked == false) {
		event.target.parentNode.getElementsByTagName('textarea')[0].classList.remove("redline");
		if (visibleTaskList.parentNode.querySelector('ol[class*="complete"]') && event.target.parentNode.parentNode.classList.contains('complete')) {
  		var cloneClass = event.target.parentNode.className;
  		visibleTaskList.querySelector('[class*="'+cloneClass+'"').removeAttribute('style');
  		visibleTaskList.querySelector('[class*="'+cloneClass+'"').querySelector('[type="checkbox"]').checked = false;
  		visibleTaskList.querySelector('[class*="'+cloneClass+'"').querySelector('textarea').classList.remove("redline");
  		visibleTaskList.querySelector('[class*="'+cloneClass+'"').removeAttribute('class');
  		event.target.parentNode.remove();
			start = visibleTaskList.getElementsByTagName('li').length - visibleTaskList.querySelectorAll('[class*="redline"]').length + 1;
  		visibleTaskList.parentNode.querySelector('ol[class*="complete"]').setAttribute('start', start);
  		updateTasksArray();
		}	
	} else {
		event.target.parentNode.getElementsByTagName('textarea')[0].classList.add("redline");
		if (visibleTaskList.parentNode.querySelector('ol[class*="complete"]')) {
			var linkNumber = btoa(Math.floor(Math.random() * Math.pow(2, 64)));
			event.target.parentNode.classList.add(linkNumber);
  		var completeClone = event.target.parentNode.cloneNode(true);
  		completeClone.classList.add(linkNumber);
			Array.from(completeClone.children).forEach(e => e.removeAttribute('name'));
			visibleTaskList.parentNode.querySelector('ol[class*="complete"]').appendChild(completeClone);
			start = visibleTaskList.getElementsByTagName('li').length - visibleTaskList.querySelectorAll('[class*="redline"]').length + 1;
  		visibleTaskList.parentNode.querySelector('ol[class*="complete"]').setAttribute('start', start);
  		event.target.parentNode.style.display = 'none';
  		updateTasksArray();
		}		
  }
}

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
	            }
                // применение новой длины к исходному элементу
                element.style.width = size + 'px';
            }, 0);
        }
        update();
        element.onkeydown = update;
    });
}

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
	}
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
	var checkbox, checkboxName, task, taskName;
	for (j = 0; j < initCheckboxName.length; j++) {
		initCheckboxName[j].name = "checkbox[" + tabNewPos + "][]";
	}
	for (n = 0; n < initTaskName.length; n++) {
		initTaskName[n].name = "Task[" + tabNewPos + "][]";
	}
	if (tabInitPos > tabNewPos) {
		for (i = tabNewPos - 1; i < tabInitPos - 1; i++) {
			checkbox = tabContent[i].querySelectorAll('[name*="checkbox"]');
			for (j = 0; j < checkbox.length; j++) {
				checkboxName = checkbox[j].name;
				checkbox[j].name = "checkbox[" + (parseInt(checkboxName.match(/\d+/g), 10) + 1) + "][]";
			}
			task = tabContent[i].querySelectorAll('[name*="Task"]');
			for (n = 0; n < task.length; n++) {
				taskName = task[n].name;
				task[n].name = "Task[" + (parseInt(taskName.match(/\d+/g), 10) + 1) + "][]";
			}
		}
		form.insertBefore(tabContent[tabInitPos-1], tabContent[tabNewPos-1]);
	}
	if (tabInitPos < tabNewPos) {
		for (i = tabInitPos; i < tabNewPos; i++) {
			checkbox = tabContent[i].querySelectorAll('[name*="checkbox"]');
			for (j = 0; j < checkbox.length; j++) {
				checkboxName = checkbox[j].name;
				checkbox[j].name = "checkbox[" + (parseInt(checkboxName.match(/\d+/g), 10) - 1) + "][]";
			}
			task = tabContent[i].querySelectorAll('[name*="Task"]');
			for (n = 0; n < task.length; n++) {
				taskName = task[n].name;
				task[n].name = "Task[" + (parseInt(taskName.match(/\d+/g), 10) - 1) + "][]";
			}
		}
		form.insertBefore(tabContent[tabInitPos-1], tabContent[tabNewPos]);
	}
	
}

var drakeTasks = dragula([],{
	direction: 'vertical',
	invalid: function (el, handle) {
		if (el.tagName == 'SPAN' || el.tagName == 'LI'){
			return false;
		} else {
			return true;
		}
	}
});

drakeTasks.on('drag', function(el){
	el.querySelector('span[class*=drag]').classList.remove('icon-hand-paper-o');
	el.querySelector('span[class*=drag]').classList.add('icon-hand-grab-o');
	el.style.cursor = 'none';
	Array.from(el.children).forEach(function(child){
    	child.style.cursor = 'none';
    });
});

drakeTasks.on('dragend', function(el){
	el.querySelector('span[class*=drag]').classList.remove('icon-hand-grab-o');
	el.querySelector('span[class*=drag]').classList.add('icon-hand-paper-o');
	el.style.removeProperty('cursor');
	Array.from(el.children).forEach(function(child){
    	child.style.removeProperty('cursor');
    });
});

function setTasksDragging() {
	var taskList = document.querySelectorAll('.tabContent>ol');
	for (i=0; i < taskList.length; i++) {
		drakeTasks.containers.push(taskList[i]);
	}
}

document.body.addEventListener("click", function(){
	if (event.target.classList.contains("list-styler")) {
		event.target.parentNode.querySelectorAll('ol').forEach(elem => elem.classList.toggle('list-unstyled'));
		event.target.firstElementChild.value ^= 1;
	}
	if (event.target.classList.contains("list-sorter")) {
		event.target.classList.toggle('icon-down-outline');
		event.target.classList.toggle('icon-up-outline');
		event.target.firstElementChild.value ^= 1;
		if (event.target.parentNode.getElementsByClassName('complete').length == 0) {
			var completeTasks = document.createElement('ol');
			completeTasks.className = "complete" + (event.target.parentNode.querySelector('ol').classList.contains('list-unstyled') ? " list-unstyled" : "");
			event.target.parentNode.appendChild(completeTasks);
		}
		Array.from(event.target.parentNode.querySelectorAll('[class*="redline"]')).forEach(function(e){
			if (event.target.firstElementChild.value == 1) {
				var linkNumber = btoa(Math.floor(Math.random() * Math.pow(2, 64)));
				e.parentNode.classList.add(linkNumber);
				var completeClone = e.parentNode.cloneNode(true);
				completeClone.classList.add(linkNumber);
				Array.from(completeClone.children).forEach(e => e.removeAttribute('name'));
				event.target.parentNode.querySelector('ol[class*="complete"]').appendChild(completeClone);
			}
			event.target.firstElementChild.value == 1 ? e.parentNode.style.display = 'none' : e.parentNode.style.removeProperty('display');
		});
		var start = visibleTaskList.getElementsByTagName('li').length - visibleTaskList.querySelectorAll('[class*="redline"]').length + 1;
		event.target.parentNode.querySelector('ol[class*="complete"]').setAttribute('start', start);
		event.target.parentNode.querySelector('ol[class*="complete"]').addEventListener("input", function(){
			var cloneText = event.target.value;
			var cloneClass = event.target.parentNode.className;
			visibleTaskList.querySelector('[class*="'+cloneClass+'"]').querySelector('textarea').value = cloneText;
		});
		updateTasksArray();
		setTasksDragging();
		if (event.target.firstElementChild.value == 0) {
			event.target.parentNode.querySelector('ol[class*="complete"]').remove();
		}		
	}
});

function listHandler(){
	var listStyle = document.querySelectorAll('[class*=list-styler]');
	var listSort = document.querySelectorAll('[class*=list-sorter]');
	listStyle.forEach(function(el){
		if (el.firstElementChild.value == 1) {			
			el.parentNode.querySelectorAll('ol').forEach(elem => elem.classList.toggle('list-unstyled'));
		}
	});
	listSort.forEach(function(el){
		if (el.firstElementChild.value == 1) {
			el.classList.toggle('icon-down-outline');
			el.classList.toggle('icon-up-outline');
			var completeTasks = document.createElement('ol');
			completeTasks.className = "complete" + (el.parentNode.querySelector('ol').classList.contains('list-unstyled') ? " list-unstyled" : "");
			el.parentNode.appendChild(completeTasks);
			Array.from(el.parentNode.querySelectorAll('[class*="redline"]')).forEach(function(e){
				var linkNumber = btoa(Math.floor(Math.random() * Math.pow(2, 64)));
				e.parentNode.classList.add(linkNumber);
				var completeClone = e.parentNode.cloneNode(true);
				completeClone.classList.add(linkNumber);
				Array.from(completeClone.children).forEach(e => e.removeAttribute('name'));
				el.parentNode.querySelector('ol[class*="complete"]').appendChild(completeClone);
				e.parentNode.style.display = 'none';
			});
			var start = el.parentNode.querySelector('ol').getElementsByTagName('li').length - el.parentNode.querySelector('ol').querySelectorAll('[class*="redline"]').length + 1;
			el.parentNode.querySelector('ol[class*="complete"]').setAttribute('start', start);
			el.parentNode.querySelector('ol[class*="complete"]').addEventListener("input", function(){
				var cloneText = event.target.value;
				var cloneClass = event.target.parentNode.className;
				visibleTaskList.querySelector('[class*="'+cloneClass+'"]').querySelector('textarea').value = cloneText;
			});
		}
	});
}

var scrollTasks = autoScroll([window],{
    margin: 40,
    maxSpeed: 10,
    scrollWhenOutside: true,
    autoScroll: function(){
        //Scroll when there is a child being dragged.
        return drakeTasks.dragging;
    }
});

listHandler();
setTasksDragging();

// оценить вероятность генерации неуникальной комбинации символов методом btoa(Math.floor(Math.random() * Math.pow(2, 64)))