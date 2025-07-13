import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

@Component({
    standalone: false,
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
    public loaded = 0;
    public paused = true;
    public volume = 100;
    private audioElement: HTMLAudioElement;
    private booted = false;
    private volumeLast = 100;

    constructor() { }


    private get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.preload = 'auto';
            this.audioElement.crossOrigin = 'anonymous';
            this.bindAudioEvent();
        }
        return this.audioElement;
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
        const audio = this.audioElement;
        audio.addEventListener('timeupdate', () => {
            if (isNaN(audio.duration) || !isFinite(audio.duration) || audio.duration <= 0) {
                this.progress = 0;
                this.duration = 0;
                this.loaded = 0;
                return;
            }
            this.progress = audio.currentTime;
            this.duration = audio.duration;
        });
        audio.addEventListener('loadedmetadata', () => {
            audio.currentTime = 0;
            if (!this.paused) {
                audio.play();
            }
        })
        audio.addEventListener('progress', () => {
            this.loaded = audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0;
        });
        audio.addEventListener('canplay', () => {
            this.loaded = audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0;
        });
        audio.addEventListener('ended', () => {
            this.paused = true;
            this.ended.emit();
        });
        audio.addEventListener('error', e => {
            this.paused = true;
        });
        audio.addEventListener('pause', () => {
            this.paused = true;
        });
        audio.addEventListener('play', () => {
            this.paused = false;
        });
        if (this.volume > 0) {
            this.volume = audio.volume * 100;
        }
    }

}
