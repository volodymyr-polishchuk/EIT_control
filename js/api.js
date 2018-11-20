const tableRowTemplate = '<tr><td>${lesson}</td><td><small>${theme}</small></td><td><span style="font-family: \'Courier New\',serif" id="timer_${timerId}">${time}</span></td><td><input type="button" value="&#10003;" class="success-button" onclick="successButtonClick(${lessonId})"><input type="button" value="&#10006;&#xFE0E;" class="cancel-button" onclick="cancelButtonClick(${lessonId})"></td></tr>';
let timers = [];

init();

function getRowElement(lessonName, themeName, time, lessonID, timerID) {
    return tableRowTemplate
        .replace("${lesson}", lessonName)
        .replace("${theme}", themeName)
        .replace("${time}", time)
        .replace("${lessonId}", lessonID)
        .replace("${lessonId}", lessonID)
		.replace("${timerId}", timerID);
}

function readyStateHandler(xmlHttpRequest, settings) {
    if (xmlHttpRequest.readyState !== 4) return;
    if (settings[xmlHttpRequest.status]) {
        settings[xmlHttpRequest.status](xmlHttpRequest);
        return;
    }
    if (xmlHttpRequest.status === 403) {
        handleException(xmlHttpRequest.status);
    } else {
        alert("Сталася помилка. Зверністься до адміністратора. " + xmlHttpRequest.status + " - " + xmlHttpRequest.statusText);
    }
}

function changeColorSchema(name) {
    let element = document.getElementsByTagName('body')[0];

}

function cancelButtonClick(lesson_id) {
	if (!confirm("Ви впевнені, що бажаєте відмінити зайняття?")) return;

	let xhr = new XMLHttpRequest();
	xhr.open('POST', 'api/cancel_lesson.php', true);
	let body = 'lesson_id=' + encodeURIComponent(lesson_id);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
	    readyStateHandler(xhr, {200: function () {
            refreshLessons();
            alert("Заняття відмінено");
	    }});
    };
	xhr.send(body);
}

function successButtonClick(lesson_id) {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', 'api/success_lesson.php', true);
	let body = 'lesson_id=' + encodeURIComponent(lesson_id);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function () {
            refreshLessons();
            alert("Заняття збережено");
        }})
    };
	xhr.send(body);	
}


function startLesson() {
	let subjectSelect = document.getElementById('subject-select');
	let selectedLessonCode = subjectSelect.options[subjectSelect.selectedIndex].value;
	let currentThemeName = document.getElementById('theme-input').value;

	if (currentThemeName === "") {
		alert("Тема не може бути пустою");
		return;
	}

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/start_lesson.php', true);
    let body = 'subject=' + encodeURIComponent(selectedLessonCode) + '&theme=' + encodeURIComponent(currentThemeName);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function () {
            refreshLessons();
            refreshThemes(selectedLessonCode);
            alert("Заняття розпочалося");
        }})
    };
	xhr.send(body);
}

function refreshLessons() {
	// Обновляти всі уроки
	// робити запит на сервер і відображати всі наявні уроки
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/all_lessons.php', true);
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function (xml) {
            let responseJSON = JSON.parse(xml.responseText);
            let table = document.getElementById('lessons_table');
            table.innerHTML = " ";
            timers.forEach(value => clearInterval(value.interval));
            timers = [];
            for (let i = 0; i < responseJSON.length; i++) {
                let timeDiff = responseJSON[i].timeToNowDiff;
                let formattedTime = timeFormat(timeDiff);

                timers[i] = {
                    id: i,
                    timeDifferenceFromServer: timeDiff,
                    timeCreate: new Date().getTime(),
                    interval: setInterval(function () {
                        let info = timers[i];
                        let timeNow;
                        if (info != null) {
                            timeNow = new Date().getTime();
                            document.getElementById("timer_" + info.id).innerText
                                = timeFormat(Number(info.timeDifferenceFromServer) + Math.floor(Number(timeNow - info.timeCreate) / 1000));
                        }
                    }, 1000)
                };

                table.innerHTML += getRowElement(responseJSON[i].lessonName, responseJSON[i].themeName, formattedTime, responseJSON[i].lessonID, i);
            }
            document.getElementById("active_lessons").style.display = (responseJSON.length === 0 ? "none" : "block");
        }})
    };
	xhr.send();
}

function timeFormat(time) {
    return Math.floor(time / 60) + ":" + ((time % 60) >= 10 ? (time % 60) : ("0" + (time % 60)))
}

function onElementSelected(owner) {
	let selectCode = owner.options[owner.selectedIndex].value;	
	refreshThemes(selectCode);
}

function refreshThemes(lessonsCode) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/all_themes.php?subject_code=' + lessonsCode, true);
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function () {
            let dataList = document.getElementById('themes-for-subject');
            while (dataList.firstChild) dataList.removeChild(dataList.firstChild);
            let responseJSON = JSON.parse(xhr.responseText);
            for (let i = 0; i < responseJSON.length; i++) {
                let option = document.createElement("option");
                option.value = responseJSON[i].name;
                dataList.appendChild(option);
            }
        }})
    };
	xhr.send();
}

function init() {
	let subjects = localStorage['subjects'];
	if (subjects != null) {
		let select = document.getElementById('subject-select');
        let responseJSON = JSON.parse(subjects);
        for (let i = 0; i < responseJSON.length; i++) {
            let option = document.createElement("option");
            option.text = responseJSON[i].name;
            option.value = responseJSON[i].k;
            select.add(option);
        }
	}

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/all_subject.php', true);
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function (xml) {
            let select = document.getElementById('subject-select');
            if (localStorage['subjects'] === xml.responseText) {
                loadDatalistForSubjectSelect();
                return;
            }
            localStorage.setItem('subjects', xml.responseText);
            let responseJSON = JSON.parse(xml.responseText);
            for (let i = 0; i < responseJSON.length; i++) {
                let option = document.createElement("option");
                option.text = responseJSON[i].name;
                option.value = responseJSON[i].k;
                select.add(option);
            }
            loadDatalistForSubjectSelect();
        }})
    };
	xhr.send();
	refreshLessons();
	setSubjectNotify();
}

function setSubjectNotify() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/get_subject_that_not_learn_yesterday.php', true);
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function (xml) {
            let responseJSON = JSON.parse(xml.responseText);
            let subjectNotify = document.getElementById('subject_notify');
            switch (responseJSON.length) {
                case 0: {
                    subjectNotify.innerHTML = "Молодець. Ти повчила всі предмети вчора";
                } break;
                case 1: case 2: case 3: {
                    subjectNotify.innerHTML = "Сьогодні варто вчити такі предмети: <br>";
                    for (let i = 0; i < responseJSON.length; i++) {
                        subjectNotify.innerHTML += (i + 1) + ". " + responseJSON[i].subjectName + "<br>";
                    }
                } break;
                case 4: {
                    subjectNotify.innerHTML = "Так, лінива жопа. Сьогодні пахаєш. Треба вчити:<br> ";
                    for (let i = 0; i < responseJSON.length; i++) {
                        subjectNotify.innerHTML += (i + 1) + ". " + responseJSON[i].subjectName + "<br>";
                    }
                    if (getCookie('subjectNotify') !== 'off') {
                        setCookie('subjectNotify', 'off');
                        alert("Альо, гальорка! Вчи давай!");
                    }
                } break;
            }
        }})
    };
	xhr.send();
}

function loadDatalistForSubjectSelect() {
    let selectElem = document.getElementById('subject-select');
    let selectCode = selectElem.options[selectElem.selectedIndex].value;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/all_themes.php?subject_code=' + selectCode, true);
    xhr.onreadystatechange = function() {
        readyStateHandler(xhr, {200: function () {
            let datalistForSubject = document.getElementById('themes-for-subject');
            let responseJSON = JSON.parse(xhr.responseText);
            while (datalistForSubject.firstChild)
                datalistForSubject.removeChild(datalistForSubject.firstChild);
            for (let i = 0; i < responseJSON.length; i++) {
                let option = document.createElement("option");
                option.value = responseJSON[i].name;
                datalistForSubject.appendChild(option);
            }
        }})
    };
	xhr.send();
}

function handleException(code) {
	if (code === 403) {
		document.location = "login.html";
	}
}