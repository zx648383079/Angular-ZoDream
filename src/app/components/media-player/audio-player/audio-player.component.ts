import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent {
    
    private readonly destroyRef = inject(DestroyRef);
    
    public readonly src = input<string>(undefined);
    public readonly mini = input(false);
    public readonly cover = input<string>(undefined);
    public readonly ended = output<void>();
    public readonly progress = signal(0);
    public readonly duration = signal(0);
    public readonly loaded = signal(0);
    public readonly paused = signal(true);
    public readonly volume = signal(100);
    private audioElement: HTMLAudioElement;
    private booted = false;
    private volumeLast = 100;

    constructor() {
        effect(() => {
            this.src();
            this.booted = false;
        });
        this.destroyRef.onDestroy(() => {
            if (this.paused()) {
                return;
            }
            this.audio.pause();
        });
    }


    private get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.preload = 'auto';
            this.audioElement.crossOrigin = 'anonymous';
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    public tapVolume() {
        if (this.volume() <= 0) {
            this.onVolumeChange(this.volumeLast);
            return;
        }
        this.volumeLast = this.volume();
        this.onVolumeChange(0);
    }

    public onVolumeChange(v: number) {
        this.volume.set(v);
        if (this.audioElement) {
            this.audioElement.volume = this.volume() / 100;
        }
    }

    public tapPlay() {
        if (!this.paused()) {
            this.audio.pause();
            return;
        }
        if (!this.booted) {
            this.audio.src = this.src();
            this.booted = true;
        }
        if (!this.src()) {
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
                this.progress.set(0);
                this.duration.set(0);
                this.loaded.set(0);
                return;
            }
            this.progress.set(audio.currentTime);
            this.duration.set(audio.duration);
        });
        audio.addEventListener('loadedmetadata', () => {
            audio.currentTime = 0;
            if (!this.paused()) {
                audio.play();
            }
        })
        audio.addEventListener('progress', () => {
            this.loaded.set(audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0);
        });
        audio.addEventListener('canplay', () => {
            this.loaded.set(audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0);
        });
        audio.addEventListener('ended', () => {
            this.paused.set(true);
            this.ended.emit();
        });
        audio.addEventListener('error', e => {
            this.paused.set(true);
        });
        audio.addEventListener('pause', () => {
            this.paused.set(true);
        });
        audio.addEventListener('play', () => {
            this.paused.set(false);
        });
        if (this.volume() > 0) {
            this.volume.set(audio.volume * 100);
        }
    }

}
