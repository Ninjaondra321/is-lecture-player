var Component = videojs.getComponent('Component');

class SpeedControl extends Component {

    constructor(player, options) {
        super(player, options);
        this.updateState = this.updateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.incrementSpeed = this.incrementSpeed.bind(this);
        this.decrementSpeed = this.decrementSpeed.bind(this);

        player.on('ratechange', this.updateState);
        player.on('loadedmetadata', this.updateTooltip);
    }

    createEl() {
        const container = videojs.dom.createEl('div', {
            className: 'vjs-speed-control vjs-control'
        });

        this.minusBtn = videojs.dom.createEl('button', {
            className: 'vjs-speed-btn',
            innerHTML: '-',
            title: 'Decrease Speed'
        });

        this.input = videojs.dom.createEl('input', {
            className: 'vjs-speed-input',
            type: 'text',
            value: '100%'
        });

        this.plusBtn = videojs.dom.createEl('button', {
            className: 'vjs-speed-btn',
            innerHTML: '+',
            title: 'Increase Speed'
        });

        this.tooltip = videojs.dom.createEl('div', {
            className: 'vjs-speed-tooltip',
            innerHTML: '0m saved'
        });

        container.appendChild(this.minusBtn);
        container.appendChild(this.input);
        container.appendChild(this.plusBtn);
        container.appendChild(this.tooltip);

        this.minusBtn.onclick = () => this.decrementSpeed();
        this.plusBtn.onclick = () => this.incrementSpeed();

        this.input.onchange = (e) => this.handleInputChange(e);
        this.input.onkeydown = (e) => this.handleInput(e);

        this.input.onfocus = () => this.input.select();

        return container;
    }

    updateState() {
        this.input.value = Math.round(this.player_.playbackRate() * 100) + '%';
        this.updateTooltip();
    }

    updateTooltip = () => {
        let rate = this.player_.playbackRate();
        let duration = this.player_.duration();

        if (this.player_.playbackRate() == 1) {
            this.tooltip.innerHTML = `Normal speed`;
            return;
        }

        let savedSeconds = Math.ceil(Math.abs(duration - (duration / rate)));
        let savedMinutes = Math.ceil(savedSeconds / 60);

        let savedTime = Math.abs(savedMinutes);
        let unit = "min";
        if (savedTime == 0) {
            savedTime = Math.abs(savedSeconds);
            unit = "sec";
        }
        let comparation = (rate < 1) ? "slower" : "faster 🎉 "

        this.tooltip.innerHTML = `${savedMinutes} ${unit} ${comparation}`;
    }

    handleInput(e) {
        const isControlKey = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
        ].includes(e.key);

        const isCommand = (e.ctrlKey === true || e.metaKey === true) &&
            ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());
        const isNumber = /^[0-9]$/.test(e.key);

        if (!isNumber && !isControlKey && !isCommand) {
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            this.input.blur();
            e.preventDefault();
        }
        e.stopPropagation();
    }

    handleInputChange(e) {
        let val = parseFloat(e.target.value.replace('%', ''));

        if (isNaN(val)) {
            this.updateState();
            return;
        }

        val = Math.max(0.1, Math.min(val / 100, 16));

        this.player_.playbackRate(val);
        this.updateState();
    }

    incrementSpeed = () => {
        let current = this.player_.playbackRate();
        this.player_.playbackRate(current + 0.05);
    }

    decrementSpeed = () => {
        let current = this.player_.playbackRate();
        this.player_.playbackRate(Math.max(0.1, current - 0.05));
    }
}

videojs.registerComponent('videojs-speed-ctrl', SpeedControl);

