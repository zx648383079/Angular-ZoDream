import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, Renderer2, SimpleChanges, inject, input, output, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScreenFull, mediaIsFrame } from '../util';

@Component({
    standalone: false,
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnChanges, AfterViewInit, OnDestroy {
    private sanitizer = inject(DomSanitizer);
    private render = inject(Renderer2);


    private readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('playerVideo');
    public readonly src = input<string>(undefined);
    public readonly cover = input<string>(undefined);
    public readonly ended = output<void>();
    public paused = true;
    public booted = false;
    public isFrame = false;
    public formatSrc: SafeResourceUrl;
    public progress = 0;
    public duration = 0;
    public loaded = 0;
    public volume = 100;
    public isFull = false;
    private volumeLast = 100;
    private bootedEvent = false;

    public get videoPlayer() {
        const videoElement = this.videoElement();
        return videoElement && videoElement.nativeElement ? videoElement.nativeElement : undefined;
    }

    ngOnDestroy() {
        if (this.paused || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
    }

    ngAfterViewInit() {
        this.bindVideoEvent();
        this.render.listen(document, ScreenFull.changeEvent, () => {
            this.isFull = ScreenFull.isFullScreen;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.src) {
            this.booted = false;
            this.isFrame = mediaIsFrame(changes.src.currentValue);
            if (this.isFrame) {
                this.formatSrc = this.sanitizer.bypassSecurityTrustResourceUrl(changes.src.currentValue);
            }
        }
    }

    public tapPlay() {
        if (!this.booted) {
            this.initVideo();
            return;
        }
        if (this.paused) {
            this.play();
            return;
        }
        this.pause();
    }

    private initVideo() {
        this.booted = true;
        if (this.isFrame) {
            return;
        }
        setTimeout(() => {
            this.bindVideoEvent();
            this.play();
        }, 100);
    }

    private play() {
        if (this.isFrame || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.play();
    }

    private pause() {
        if (this.isFrame || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
    }

    private stop() {
        if (this.isFrame || !this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
        this.src = '';
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
        if (this.videoPlayer) {
            this.videoPlayer.volume = this.volume / 100;
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
        if (this.isFull) {
            this.exitFullscreen();
            this.isFull = false;
            return;
        }
        this.fullScreen();
        this.isFull = true;
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
                this.progress = 0;
                this.duration = 0;
                this.loaded = 0;
                return;
            }
            this.progress = video.currentTime;
            this.duration = video.duration;
        });
        video.addEventListener('progress', () => {
            this.loaded = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
        });
        video.addEventListener('canplay', () => {
            this.loaded = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
        });
        video.addEventListener('ended', () => {
            this.paused = true;
            // TODO: The 'emit' function requires a mandatory void argument
            this.ended.emit();
        });
        video.addEventListener('pause', () => {
            this.paused = true;
        });
        video.addEventListener('error', e => {
            this.paused = true;
        });
        video.addEventListener('play', () => {
            this.paused = false;
        });
        if (this.volume > 0) {
            this.volume = video.volume * 100;
        }
    }
}
