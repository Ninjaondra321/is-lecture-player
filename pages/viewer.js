
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const src = urlParams.get('src');
document.getElementById("video_src").src = src;
document.getElementById("download_button").href = src;

console.log(src);

