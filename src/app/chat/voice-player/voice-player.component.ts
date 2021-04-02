import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { formatHour } from '../../theme/utils';

@Component({
  selector: 'app-voice-player',
  templateUrl: './voice-player.component.html',
  styleUrls: ['./voice-player.component.scss']
})
export class VoicePlayerComponent implements OnChanges, OnDestroy {

    @Input() public src: string;

    public progress = 0;
    public time = '00:00';
    public total = '00:00';
    public paused = true;
    private audioElement: HTMLAudioElement;
    private duration = 0;

    constructor() { }


    get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.src) {
            // this.loadAudio(changes.src.currentValue);
        }
    }

    ngOnDestroy() {
        if (this.paused) {
            return;
        }
        this.audio.pause();
    }

    public tapPlay() {
        if (!this.paused) {
            this.audio.pause();
            return;
        }
        this.audio.src = this.src;
        this.audio.play();
    }

    public onProgressChange(i: number) {
        this.audio.currentTime = i * this.audio.duration / 100;
        this.audio.play();
    }


    private bindAudioEvent() {
        this.audioElement.addEventListener('timeupdate', () => {
            this.progress = isNaN(this.audioElement.duration) || this.audioElement.duration <= 0 ? 0 :
                this.audioElement.currentTime * 100 / this.audioElement.duration;
            this.time = formatHour(Math.floor(this.audioElement.currentTime), 'ii:ss', true);
            this.total = formatHour(Math.floor(this.audioElement.duration), 'ii:ss', true);
        });
        this.audioElement.addEventListener('ended', () => {
            this.paused = true;
        });
        this.audioElement.addEventListener('pause', () => {
            this.paused = true;
        });
        this.audioElement.addEventListener('play', () => {
            this.paused = false;
        });
    }
}
