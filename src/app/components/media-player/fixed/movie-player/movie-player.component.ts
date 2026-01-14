import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, inject, input, signal, viewChild } from '@angular/core';
import { ScreenFull } from '../../util';
import { IMediaFile, PlayerEvent, PlayerEvents, PlayerListeners } from '../model';
import Hls from 'hls.js';
import { findIndex } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-movie-player',
    templateUrl: './movie-player.component.html',
    styleUrls: ['./movie-player.component.scss']
})
export class MoviePlayerComponent implements PlayerEvent, AfterViewInit, OnDestroy {
    private render = inject(Renderer2);


    private readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('playerVideo');
    private readonly barElement = viewChild<ElementRef<HTMLDivElement>>('playerBar');
    public readonly isFixed = input(true);
    public readonly speedable = input(true);
    public paused = true;
    public booted = false;
    public isFull = false;
    public openCatalog = false;
    public moreVisible = false;
    public morePanelVisible = false;
    public readonly items = signal<IMediaFile[]>([]);
    public data: IMediaFile;
    public index = -1;
    public progress = 0;
    public duration = 0;
    public loaded = 0;
    public volume = 100;
    public bodyHeight = 100;
    private volumeLast = 100;
    private listeners: {
        [key: string]: Function[];
    } = {};

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
        this.render.listen(window, 'resize', () => {
            this.resize();
        });
        this.resize();
    }

    private resize() {
        const video = this.videoPlayer;
        if (!video) {
            return;
        }
        const bar = this.barElement().nativeElement;
        const barHeight = bar ? bar.clientHeight : 0;
        setTimeout(() => {
            this.bodyHeight = video.height = window.innerHeight - (this.isFull ? 0 : barHeight);
        }, 1);
    }

    public play(): void;
    public play(item: IMediaFile): void;
    public play(item?: IMediaFile): void {
        let i = 0;
        if (item) {
            this.push(item);
            i = this.indexOf(item);
        }
        if (i < 0 || i >= this.items().length) {
            return;
        }
        if (!this.videoPlayer) {
            return;
        }
        this.index = i;
        this.data = this.items[i];
        this.loadSource(this.items[i].source);
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
        this.items.update(v => {
            const next = items.filter(i => findIndex(v, j => j.source == i.source) < 0);
            return [...v, ...next];
        });
    }

    public indexOf(item: IMediaFile): number {
        const items = this.items();
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].source === item.source) {
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

    private loadSource(src: string) {
        const video = this.videoPlayer;
        if (src.indexOf('.m3u8') < 0 || video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            //
            // If no native HLS support, check if HLS.js is supported
            //
        } else if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
        }
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
            this.emit(PlayerEvents.TIME_UPDATE);
            if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) {
                this.progress = 0;
                this.duration = 0;
                this.loaded = 0;
                return;
            }
            this.progress = video.currentTime;
            this.duration = video.duration;
        });
        video.addEventListener('canplay', () => {
            this.loaded = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
        });
        video.addEventListener('progress', () => {
            this.loaded = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
        });
        video.addEventListener('error', () => {
            this.paused = true;
        });
        video.addEventListener('ended', () => {
            this.paused = true;
            this.emit(PlayerEvents.ENDED);
            this.data.active = false;
        });
        video.addEventListener('pause', () => {
            this.paused = true;
            this.emit(PlayerEvents.PAUSE);
        });
        video.addEventListener('play', () => {
            this.paused = false;
            this.data.active = true;
            this.emit(PlayerEvents.PLAY);
        });
        if (this.volume > 0) {
            this.volume = video.volume * 100;
        }
    }

    public on<E extends keyof PlayerListeners>(event: E, listener: PlayerListeners[E]): void;
    public on(event: string, cb: any) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit<E extends keyof PlayerListeners>(event: E, ...eventObject: Parameters<PlayerListeners[E]>): void;
    public emit(event: string, ...items: any[]) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
        }
        const listeners = this.listeners[event];
        for (let i = listeners.length - 1; i >= 0; i--) {
            const cb = listeners[i];
            const res = cb(...items);
            //  允许事件不进行传递
            if (res === false) {
                break;
            }
        }
    }

    public off<E extends keyof PlayerListeners>(event: E, listener?: PlayerListeners[E] | undefined): void;
    public off(...events: any[]) {
        if (events.length == 2 && typeof events[1] === 'function') {
            return this.offListener(events[0], events[1]);
        }
        for (const event of events) {
            delete this.listeners[event];
        }
    }

    private offListener(event: string, cb: Function) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
        }
        const items = this.listeners[event];
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i] === cb) {
                items.splice(i, 1);
            }
        }
    }
}
