import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScreenFull, mediaIsFrame } from '../util';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnChanges, AfterViewInit, OnDestroy {

    @ViewChild('playerVideo')
    private videoElement: ElementRef<HTMLVideoElement>;
    @Input() public src: string;
    @Input() public cover: string;
    @Output() public ended = new EventEmitter<void>();
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

    constructor(
        private sanitizer: DomSanitizer,
        private render: Renderer2,
    ) { }

    public get videoPlayer() {
        return this.videoElement && this.videoElement.nativeElement ? this.videoElement.nativeElement : undefined;
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
