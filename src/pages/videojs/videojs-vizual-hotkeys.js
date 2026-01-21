videojs.registerPlugin('videojs-vizual-hotkeys', function (options) {
    const player = this;

    const settings = videojs.obj.merge({
        volumeStep: 0.1,
        seekStep: 10,
        speedStep: 0.25,
        popupVisibleTime: 500
    }, options);

    player.ready(function () {
        let overlay = document.createElement('div');
        overlay.className = 'vjs-feedback-overlay';
        player.el().appendChild(overlay);

        let feedbackTimeout;

        function showFeedback(text) {
            overlay.innerText = text;
            overlay.classList.add('active');

            clearTimeout(feedbackTimeout);

            feedbackTimeout = setTimeout(function () {
                overlay.classList.remove('active');
            }, settings.popupVisibleTime);
        }

        this.on('keydown', function (event) {
            switch (event.which) {
                // Up Arrow - Volume Up
                case 38:
                    event.preventDefault();
                    var newVolUp = Math.min(player.volume() + settings.volumeStep, 1);
                    player.volume(newVolUp);
                    showFeedback("🔊 " + Math.round(newVolUp * 100) + "%");
                    break;

                // Down Arrow - Volume Down
                case 40:
                    event.preventDefault();
                    var newVolDown = Math.max(player.volume() - settings.volumeStep, 0);
                    player.volume(newVolDown);
                    showFeedback("🔉 " + Math.round(newVolDown * 100) + "%");
                    break;

                // Left Arrow - Rewind
                case 37:
                    event.preventDefault();
                    player.currentTime(player.currentTime() - settings.seekStep);
                    showFeedback("⏪ " + settings.seekStep + "s");
                    break;

                // Right Arrow - Forward
                case 39:
                    event.preventDefault();
                    player.currentTime(player.currentTime() + settings.seekStep);
                    showFeedback("⏩ " + settings.seekStep + "s");
                    break;

                // 'M' Key - Mute Toggle
                case 77:
                    event.preventDefault();
                    if (player.muted()) {
                        player.muted(false);
                        showFeedback("🔊 Unmuted");
                    } else {
                        player.muted(true);
                        showFeedback("🔇 Muted");
                    }
                    break;

                // Spacebar/Enter - Play/Pause
                case 32:
                case 13:
                    event.preventDefault();
                    if (player.paused()) {
                        player.play();
                        showFeedback("▶");
                    } else {
                        player.pause();
                        showFeedback("⏸");
                    }
                    break;

                // "f" - Toggle Fullscreen
                case 70:
                    event.preventDefault();
                    if (player.isFullscreen()) {
                        player.exitFullscreen();
                    } else {
                        player.requestFullscreen();
                    }
                    break;

                // ">" (Shift + Period) - Faster
                case 190:
                    if (event.shiftKey) {
                        event.preventDefault();
                        var newRateUp = player.playbackRate() + settings.speedStep;
                        player.playbackRate(newRateUp);
                        showFeedback("🐇 " + newRateUp + "x");
                    }
                    break;

                // "<" (Shift + Comma) - Slower
                case 188:
                    if (event.shiftKey) {
                        event.preventDefault();
                        var newRateDown = Math.max(player.playbackRate() - settings.speedStep, settings.speedStep);
                        player.playbackRate(newRateDown);
                        showFeedback("🐢 " + newRateDown + "x");
                    }
                    break;

            }
        });
    });
});
