checkTheme();

function checkTheme() {
    let styleTheme = getCookie('style-theme');
    if (styleTheme != null) {
        let oldLink = document.getElementsByTagName("link").item(0);

        let newLink = document.createElement("link");
        newLink.setAttribute("rel", "stylesheet");
        newLink.setAttribute("type", "text/css");
        if (styleTheme === "white") {
            newLink.setAttribute("href", "css/main_white.css");
            document.getElementsByTagName("head").item(0).replaceChild(newLink, oldLink);
            window.onload = function () {
                let subjectIconBlack = document.getElementById("subject_icon_black");
                if (subjectIconBlack != null) {
                    subjectIconBlack.style.display = "block";
                    document.getElementById("subject_icon_white").style.display = "none";
                    document.getElementById("theme_icon_black").style.display = "block";
                    document.getElementById("theme_icon_white").style.display = "none";
                }
            };
        } else if (styleTheme === "dark") {
            newLink.setAttribute("href", "css/main_dark.css");
            document.getElementsByTagName("head").item(0).replaceChild(newLink, oldLink);
            window.onload = function() {
                let subjectIconBlack = document.getElementById("subject_icon_black");
                if (subjectIconBlack != null) {
                    subjectIconBlack.style.display = "none";
                    document.getElementById("subject_icon_white").style.display = "block";
                    document.getElementById("theme_icon_black").style.display = "none";
                    document.getElementById("theme_icon_white").style.display = "block";
                }
            };
        }
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