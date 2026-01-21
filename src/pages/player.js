
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const src = urlParams.get('src');
document.getElementById("video_src").src = src;
document.getElementById("download_button").href = src;

console.log(src);

let player = videojs('my-video', {
    plugins: {
        'videojs-vizual-hotkeys': {
            // seekStep: 5,        // Seek 5 seconds instead of 10
            // volumeStep: 0.2     // Change volume by 20%
        }
    }
});

player.ready(function () {
    let controlBar = player.getChild('controlBar');
    controlBar.addChild('videojs-speed-ctrl', {}, controlBar.children().length - 2);
});


player.play();