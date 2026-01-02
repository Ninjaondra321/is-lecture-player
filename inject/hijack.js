const nativeConfirm = window.confirm;

window.confirm = function (message) {
    const viewerBaseUrl = document.documentElement.getAttribute('player-url');
    const html = document.body.innerHTML;
    const url_regex = /https?:\/\/[^\s$.?#].[^\s]*/g;
    const urls = html.match(url_regex);
    const target = viewerBaseUrl + "?src=" + encodeURIComponent(urls[1]);

    const answer = nativeConfirm(message);

    if (answer) {
        window.location = target;
        noTimeIsTheBest // Create an error so that no result is returned to main script
    } else {
        return answer
    }
};