//init

window.onload = function() {
    let userLogin = document.getElementById("user_login");
    let userName = document.getElementById("user_name");
    let description = document.getElementById("description");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/get_user_info.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            userLogin.innerText = response.login;
            userName.innerText = response.name;
            description.innerText = response.description;
        } else {
            handleException(xhr.status);
        }
    };
    xhr.send();
};

function onLogoutClick() {
    setCookie('auth-token', null, {expires: -1});
    setCookie('auth-k', null, {expires: -1});
    document.location.href = 'login.html';
}

function handleException(code) {
    if (code === 403) {
        document.location = "https://hwork.net/polishchuk/eit/login.html";
    }
}