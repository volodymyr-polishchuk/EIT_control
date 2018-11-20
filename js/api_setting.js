init();
function init() {
    const userInfoFromLocalStorage = localStorage['userInfo'];
    let userLogin = document.getElementById("user_login");
    let userName = document.getElementById("user_name");
    let description = document.getElementById("description");

    if (userInfoFromLocalStorage != null) {
        const userInfoFromLocalStorageObj = JSON.parse(userInfoFromLocalStorage);
        userLogin.innerText = userInfoFromLocalStorageObj.login;
        userName.innerText = userInfoFromLocalStorageObj.name;
        description.innerText = userInfoFromLocalStorageObj.description;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/get_user_info.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            if (xhr.responseText === localStorage['userInfo']) return;
            localStorage.setItem('userInfo', xhr.responseText);
            let userInfoFromServer = JSON.parse(xhr.responseText);
            userLogin.innerText = userInfoFromServer.login;
            userName.innerText = userInfoFromServer.name;
            description.innerText = userInfoFromServer.description;
        } else {
            handleStatus(xhr.status);
        }
    };
    xhr.send();
}

function onLogoutClick() {
    setCookie('auth-token', null, {expires: -1});
    setCookie('auth-k', null, {expires: -1});
    document.location.href = 'login.html';
}

function handleStatus(code) {
    if (code === 403) {
        document.location = "login.html";
    }
}