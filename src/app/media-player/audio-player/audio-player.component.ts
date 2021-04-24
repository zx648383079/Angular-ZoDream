import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { twoPad } from '../../theme/utils';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnDestroy, OnChanges {
    
    @Input() public src: string;
    @Input() public mini = false;
    @Input() public cover: string;
    @Output() public ended = new EventEmitter<void>();
    public progress = 0;
    public duration = 0;
    public paused = true;
    public volume = 100;
    private audioElement: HTMLAudioElement;
    private booted = false;
    private volumeLast = 100;

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

    public tapVolume() {
        if (this.volume <= 0) {
            this.onVolumeChange(this.volumeLast);
            return;
        }
        this.volumeLast = this.volume;
        this.onVolumeChange(0);
    }

    public onVolumeChange(v: number) {
        this.volume = v;
        if (this.audioElement) {
            this.audioElement.volume = this.volume / 100;
        }
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
            this.ended.emit();
        });
        this.audioElement.addEventListener('pause', () => {
            this.paused = true;
        });
        this.audioElement.addEventListener('play', () => {
            this.paused = false;
        });
        if (this.volume > 0) {
            this.volume = this.audioElement.volume * 100;
        }
    }
    
    private formatMinute(time: number): string {
        return [Math.floor(time / 60), Math.floor(time % 60)].map(twoPad).join(':');
    }

}
