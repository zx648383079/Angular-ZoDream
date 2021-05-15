import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { twoPad } from '../../theme/utils';

@Component({
  selector: 'app-voice-player',
  templateUrl: './voice-player.component.html',
  styleUrls: ['./voice-player.component.scss']
})
export class VoicePlayerComponent implements OnChanges, OnDestroy {

    @Input() public src: string;
    public progress = 0;
    public duration = 0;
    public paused = true;
    private audioElement: HTMLAudioElement;
    private booted = false;

    constructor() { }


    private get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    public get formatProgress() {
        return this.formatMinute(this.progress);
    }

    public get formatDuration() {
        return this.formatMinute(this.duration);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.src) {
            this.booted = false;
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
        if (!this.booted) {
            this.audio.src = this.src;
            this.booted = true;
        }
        if (!this.src) {
            return;
        }
        this.audio.play();
    }

    public onProgressChange(i: number) {
        this.audio.currentTime = i;
        this.audio.play();
    }


    private bindAudioEvent() {
        this.audioElement.addEventListener('timeupdate', () => {
            if (isNaN(this.audioElement.duration) || !isFinite(this.audioElement.duration) || this.audioElement.duration <= 0) {
                this.progress = 0;
                this.duration = 0;
                return;
            }
            this.progress = this.audioElement.currentTime;
            this.duration = this.audioElement.duration;
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

    private formatMinute(time: number): string {
        return [Math.floor(time / 60), Math.floor(time % 60)].map(twoPad).join(':');
    }
}
