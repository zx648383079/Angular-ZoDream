import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { twoPad } from '../../theme/utils';
import { ScreenFull } from '../screen-full';

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
    public volume = 100;
    public isFull = false;
    private volumeLast = 100;
    private bootedEvent = false;

    constructor(
        private sanitizer: DomSanitizer,
        private render: Renderer2,
    ) { }

    public get formatProgress() {
        return this.formatMinute(this.progress);
    }

    public get formatDuration() {
        return this.formatMinute(this.duration);
    }

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
            this.isFrame = this.playerType(changes.src.currentValue);
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
                return;
            }
            this.progress = video.currentTime;
            this.duration = video.duration;
        });
        video.addEventListener('ended', () => {
            this.paused = true;
            this.ended.emit();
        });
        video.addEventListener('pause', () => {
            this.paused = true;
        });
        video.addEventListener('play', () => {
            this.paused = false;
        });
        if (this.volume > 0) {
            this.volume = video.volume * 100;
        }
    }

    private playerType(src: string): boolean {
        const maps = [
            'player.youku.com',
            'player.bilibili.com',
            'v.qq.com',
            'open.iqiyi.com',
        ];
        for (const host of maps) {
            if (this.src.indexOf(host) > 0) {
                return true;
            }
        }
        return false;
    }

    private formatMinute(time: number): string {
        return [Math.floor(time / 60), Math.floor(time % 60)].map(twoPad).join(':');
    }

}
