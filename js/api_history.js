const tablePattern = "<tr><td>${subject}</td><td>${theme}</td><td>${time}</td></tr>";

init();
function init() {
    getAllSubject();
}

function createRowFromPattern(subject, theme, time) {
    return tablePattern
        .replace("${subject}", subject)
        .replace("${theme}", theme)
        .replace("${time}", time);
}

function onSearchButtonClick() {
    let subjectSelectValue = document.getElementById('subject_select')
        .options[document.getElementById('subject_select').selectedIndex].value;
    let groupByValue = document.getElementById('group_by_checkbox').checked ? 1 : 0;
    let fromDateValue = document.getElementById('from_date_input').value;
    let toDateValue = document.getElementById('to_date_input').value;

    let xhr = new XMLHttpRequest();
    const url = 'api/get_history.php?' +
        'subject=' + subjectSelectValue + '&' +
        'group=' + groupByValue + '&' +
        'from_date=' + fromDateValue + '&' +
        'to_date=' + toDateValue;

    xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) return;
		if (xhr.status === 200) {
            let historyResponse = JSON.parse(xhr.responseText);
            let historyTable = document.getElementById('history_table');
            historyTable.innerHTML = " ";

			for (let i = 0; i < historyResponse.length; i++) {
                let formattedTime = timeFormatter(historyResponse[i].time);
                historyTable.innerHTML += createRowFromPattern(
                    historyResponse[i].subjectName,
                    historyResponse[i].themeName,
                    formattedTime
                );
			}

            document.getElementById("nothing_to_show_block").style.display = (historyResponse.length === 0 ? "block" : "none");
            document.getElementById("block_with_result").style.display = (historyResponse.length === 0 ? "none" : "block");
		} else {
            handleStatus(xhr.status);
        }
	};
	xhr.send();
}

function onTodayButtonClick() {
    document.getElementById('from_date_input').valueAsNumber =
        document.getElementById('to_date_input').valueAsNumber = Date.now();
	onSearchButtonClick();
}

function onYesterdayButtonClick() {
    document.getElementById('from_date_input').valueAsNumber =
        document.getElementById('to_date_input').valueAsNumber = new Date(Date.now() - 864e5);
	onSearchButtonClick();
}

function onLastWeekButtonClick() {
    document.getElementById('from_date_input').valueAsNumber = new Date(Date.now() - 864e5 * 7);
    document.getElementById('to_date_input').valueAsNumber = Date.now();
	onSearchButtonClick();
}

function onClearButtonClick() {
    document.getElementById('from_date_input').value = "";
    document.getElementById('to_date_input').value = "";
}

function timeFormatter(time) {
	return Math.floor(time / 60) + ":" + ((time % 60) >= 10 ? (time % 60) : ("0" + (time % 60)))
}

function getAllSubject() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'api/all_subject.php', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) return;

		if (xhr.status === 200) {
            let select = document.getElementById('subject_select');
            select.innerHTML = " ";
            select.add(createOption("Всі предмети", "0"));
            let subjectResponse = JSON.parse(xhr.responseText);
			for (let i = 0; i < subjectResponse.length; i++) {
				select.add(createOption(subjectResponse[i].name, subjectResponse[i].k));
			}
		} else  {
            handleStatus(xhr.status);
        }
	};
	xhr.send();	
}

function createOption(text, value) {
    let option = document.createElement("option");
    if (value)
        option.value = value;
    if (text)
        option.text = text;
    return option;
}

function handleStatus(code) {
    if (code === 403) {
        document.location = "login.html";
    } else {
        alert("Сталася помилка. Зверніться до адміністратора. " + xhr.status + " - " + xhr.statusText);
    }
}