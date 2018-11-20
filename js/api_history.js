const tablePattern = "<tr><td>${subject}</td><td>${theme}</td><td>${time}</td></tr>";

init();
function init() {
    getAllSubject();
}

function getTableRowFromPattern(subject, theme, time) {
    return tablePattern
        .replace("${subject}", subject)
        .replace("${theme}", theme)
        .replace("${time}", time);
}

function onSearchButtonClick() {
    let subjectSelectValue = document.getElementById('subject_select').options[document.getElementById('subject_select').selectedIndex].value;
    let groupByValue = document.getElementById('group_by_checkbox').checked ? 1 : 0;
    let fromDateValue = document.getElementById('from_date_input').value;
    let toDateValue = document.getElementById('to_date_input').value;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/get_history.php?subject=' + subjectSelectValue + '&group=' + groupByValue + '&from_date=' + fromDateValue + '&to_date=' + toDateValue, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) return;
		if (xhr.status === 200) {
            let responseJSON = JSON.parse(xhr.responseText);
            let table = document.getElementById('history_table');
            table.innerHTML = " ";

			for (let i = 0; i < responseJSON.length; i++) {
                let formattedTime = timeFormatter(responseJSON[i].time);
                table.innerHTML += getTableRowFromPattern(responseJSON[i].subjectName, responseJSON[i].themeName, formattedTime);
			}
			if (responseJSON.length === 0) {
			    document.getElementById("nothing_to_show_block").style.display = "block";
			    document.getElementById("block_with_result").style.display = "none";
            } else {
                document.getElementById("nothing_to_show_block").style.display = "none";
                document.getElementById("block_with_result").style.display = "block";
            }
		} else  if (xhr.status === 403) {
            handleException(xhr.status);
        } else {
			alert("Сталася помилка. Зверністься до адміністратора. " + xhr.status + " - " + xhr.statusText);
		}
	};
	xhr.send();
}

function onTodayButtonClick() {
    document.getElementById('from_date_input').valueAsNumber = Date.now();
    document.getElementById('to_date_input').valueAsNumber = Date.now();
	onSearchButtonClick();
}

function onYesterdayButtonClick() {
    document.getElementById('from_date_input').valueAsNumber = new Date(Date.now() - 864e5);
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
            let responseJSON = JSON.parse(xhr.responseText);
            let zeroOption = document.createElement("option");
			zeroOption.text = "Всі предмети"; zeroOption.value = "0"; 
			select.add(zeroOption);

			for (let i = 0; i < responseJSON.length; i++) {
                let option = document.createElement("option");
				option.text = responseJSON[i].name;
				option.value = responseJSON[i].k; 
				select.add(option);
			}
		} else  if (xhr.status === 403) {
            handleException(xhr.status);
        } else {
			console.log("Сервіс не працює. Зверніться до адміністратора. Причина " + xhr.status + " - " + xhr.statusText);
		}
	};
	xhr.send();	
}


function handleException(code) {
    if (code === 403) {
        document.location = "login.html";
    }
}