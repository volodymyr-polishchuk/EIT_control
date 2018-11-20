checkTheme();

function checkTheme() {
    let styleTheme = getCookie('style-theme');
    if (styleTheme) {
        if (styleTheme === "white") {
            changeStyle('dark', 'light');
            window.onload = function () {
                changeStyle('dark', 'light');
            };
        } else if (styleTheme === "dark") {
            changeStyle('light', 'dark');
            window.onload = function() {
                changeStyle('light', 'dark')
            };
        }
    }
}

function changeStyle(oldClassName, currentClassName) {
    let bodyElement = document.getElementsByTagName("body")[0];
    if (bodyElement) {
        bodyElement.classList.remove(oldClassName);
        bodyElement.classList.add(currentClassName);
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}