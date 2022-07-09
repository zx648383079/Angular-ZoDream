import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { ScreenFull } from '../../screen-full';
import { IMediaFile, PlayerEvent } from '../model';

@Component({
  selector: 'app-movie-player',
  templateUrl: './movie-player.component.html',
  styleUrls: ['./movie-player.component.scss']
})
export class MoviePlayerComponent implements PlayerEvent, AfterViewInit, OnDestroy {

    @ViewChild('playerVideo')
    private videoElement: ElementRef<HTMLVideoElement>;
    public paused = true;
    public booted = false;
    public isFull = false;
    public openCatalog = false;
    public items: IMediaFile[] = [];
    public data: IMediaFile;
    public progress = 0;
    public duration = 0;
    public volume = 100;
    private volumeLast = 100;

    constructor(
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

    public play(): void;
    public play(item: IMediaFile): void;
    public play(item?: IMediaFile): void {
        let i = 0;
        if (item) {
            this.push(item);
            i = this.indexOf(item);
        }
        if (i < 0 || i >= this.items.length) {
            return;
        }
        if (!this.videoPlayer) {
            return;
        }
        this.videoPlayer.src = this.items[i].source;
        this.videoPlayer.play();
    }
    public pause(): void {
        if (!this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
    }
    public stop(): void {
        if (!this.videoPlayer) {
            return;
        }
        this.videoPlayer.pause();
        this.videoPlayer.src = '';
    }
    public push(...items: IMediaFile[]): void {
        for (const item of items) {
            if (this.indexOf(item) >= 0) {
                continue;
            }
            this.items.push(item);
        }
    }

    public indexOf(item: IMediaFile): number {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].source === item.source) {
                return i;
            }
        }
        return -1;
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
        this.openCatalog = false;
    }

    private fullScreen() {
        ScreenFull.request();
    }
    
    private exitFullscreen() {
        ScreenFull.exit();
    }


    private bindVideoEvent() {
        if (this.booted) {
            return;
        }
        const video = this.videoPlayer;
        if (!video) {
            return;
        }
        this.booted = true;
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
}
