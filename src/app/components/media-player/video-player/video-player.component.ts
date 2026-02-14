import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, Renderer2, afterNextRender, effect, inject, input, model, output, signal, untracked, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScreenFull, mediaIsFrame } from '../util';

@Component({
    standalone: false,
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {
    private readonly sanitizer = inject(DomSanitizer);
    private readonly render = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);


    private readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('playerVideo');
    public readonly src = model<string>('');
    public readonly cover = input<string>();
    public readonly ended = output<void>();
    public readonly paused = signal(true);
    public readonly booted = signal(false);
    public readonly isFrame = signal(false);
    public readonly formatSrc = signal<SafeResourceUrl>(null);
    public readonly progress = signal(0);
    public readonly duration = signal(0);
    public readonly loaded = signal(0);
    public readonly volume = signal(100);
    public readonly isFull = signal(false);
    private volumeLast = 100;
    private bootedEvent = false;

    public get videoPlayer() {
        const videoElement = this.videoElement();
        return videoElement && videoElement.nativeElement ? videoElement.nativeElement : undefined;
    }

    constructor() {
        effect(() => {
            const src = this.src();
            untracked(() => {
                this.booted.set(false);
                this.isFrame.set(mediaIsFrame(src));
                if (this.isFrame()) {
                    this.formatSrc.set(this.sanitizer.bypassSecurityTrustResourceUrl(src));
                }
            });
        });
        this.render.listen(document, ScreenFull.changeEvent, () => {
            this.isFull.set(ScreenFull.isFullScreen);
        });
        afterNextRender({
            write: () => {
                this.bindVideoEvent();
            }
        });
        this.destroyRef.onDestroy(() => {
            if (this.paused() || !this.videoPlayer) {
                return;
            }
            this.videoPlayer.pause();
        });
    }

    public tapPlay() {
        if (!this.booted()) {
            this.initVideo();
            return;
        }
        if (this.paused()) {
            this.play();
            return;
        }
        this.pause();
    }

    private initVideo() {
        this.booted.set(true);
        if (this.isFrame()) {
            return;
        }
        setTimeout(() => {
            this.bindVideoEvent();
            this.play();
        }, 100);
    }

    private play() {
        if (this.isFrame() || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.play();
    }

    private pause() {
        if (this.isFrame() || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
    }

    private stop() {
        if (this.isFrame() || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
        this.src.set('');
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
        if (this.videoPlayer) {
            this.videoPlayer.volume = this.volume() / 100;
        }
    }

    public onProgressChange(i: number) {
        if (!this.videoPlayer) {
            return;
        }
        this.videoPlayer.currentTime = i;
        this.play();
    }

    public tapFullScreen() {
        if (this.isFull()) {
            this.exitFullscreen();
            this.isFull.set(false);
            return;
        }
        this.fullScreen();
        this.isFull.set(true);
    }

    private fullScreen() {
        ScreenFull.request();
    }
    
    private exitFullscreen() {
        ScreenFull.exit();
    }

    private bindVideoEvent() {
        if (this.bootedEvent) {
            return;
        }
        const video = this.videoPlayer;
        if (!video) {
            return;
        }
        this.bootedEvent = true;
        video.addEventListener('timeupdate', () => {
            if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) {
                this.progress.set(0);
                this.duration.set(0);
                this.loaded.set(0);
                return;
            }
            this.progress.set(video.currentTime);
            this.duration.set(video.duration);
        });
        video.addEventListener('progress', () => {
            this.loaded.set(video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0);
        });
        video.addEventListener('canplay', () => {
            this.loaded.set(video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0);
        });
        video.addEventListener('ended', () => {
            this.paused.set(true);
            this.ended.emit();
        });
        video.addEventListener('pause', () => {
            this.paused.set(true);
        });
        video.addEventListener('error', e => {
            this.paused.set(true);
        });
        video.addEventListener('play', () => {
            this.paused.set(false);
        });
        if (this.volume() > 0) {
            this.volume.set(video.volume * 100);
        }
    }
}
