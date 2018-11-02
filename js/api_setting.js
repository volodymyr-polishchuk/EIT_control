function onLogoutClick() {
    setCookie('auth-token', null, {expires: -1});
    setCookie('auth-k', null, {expires: -1});
    document.location.href = 'login.html';
}
