import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { twoPad } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-voice-player',
    templateUrl: './voice-player.component.html',
    styleUrls: ['./voice-player.component.scss']
})
export class VoicePlayerComponent {

    private readonly destroyRef = inject(DestroyRef);

    public readonly src = input<string>();
    public readonly progress = signal(0);
    public readonly duration = signal(0);
    public readonly paused = signal(true);
    private audioElement?: HTMLAudioElement;
    private booted = false;

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
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    public readonly formatProgress = computed(() => {
        return this.formatMinute(this.progress());
    });

    public readonly formatDuration = computed(() => {
        return this.formatMinute(this.duration());
    });

    public tapPlay() {
        if (!this.paused) {
            this.audio.pause();
            return;
        }
        if (!this.booted) {
            this.audio.src = this.src()!;
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
        const audio = this.audioElement!;
        audio.addEventListener('timeupdate', () => {
            if (isNaN(audio.duration) || !isFinite(audio.duration) || audio.duration <= 0) {
                this.progress.set(0);
                this.duration.set(0);
                return;
            }
            this.progress.set(audio.currentTime);
            this.duration.set(audio.duration);
        });
        audio.addEventListener('ended', () => {
            this.paused.set(true);
        });
        audio.addEventListener('pause', () => {
            this.paused.set(true);
        });
        audio.addEventListener('play', () => {
            this.paused.set(false);
        });
    }

    private formatMinute(time: number): string {
        return [Math.floor(time / 60), Math.floor(time % 60)].map(twoPad).join(':');
    }
}
