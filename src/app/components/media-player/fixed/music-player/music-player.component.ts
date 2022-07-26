import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { IMediaFile, PlayerEvent, PlayerListeners } from '../model';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements PlayerEvent, OnDestroy, AfterViewInit, OnChanges {

    @ViewChild('playerBar')
    private boxBody: ElementRef<HTMLDivElement>;
    @Input() public isFixed = true;
    @Input() public hidden = false;
    public lyricsWidth = 0;
    public lyricsHeight = 200;
    public catalogVisible = false;
    public lyricsVisible = false;
    public spectrumVisible = false;
    public loop = 0;
    public paused = true;
    public booted = false;
    public items: IMediaFile[] = [];
    public index = -1;
    public data: IMediaFile;
    public progress = 0;
    public duration = 0;
    public volume = 100;
    public channelData: number[] = [];
    public lyricsSrc = '';
    private audioElement: HTMLAudioElement;
    private spectrumFunc: () => void;
    private volumeLast = 100;
    private listeners: {
        [key: string]: Function[];
    } = {};

    constructor(
        private render: Renderer2,
    ) { }

    public get canPrevious() {
        return this.items.length > 1 && this.index > 0;
    }

    public get canNext() {
        return this.items.length > 1 && this.index < this.items.length - 1;
    }

    private get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.crossOrigin = "anonymous";
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    ngAfterViewInit() {
        this.render.listen(window, 'resize', () => {
            this.resize();
        });
        // this.resize();
        this.booted = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hidden && this.booted) {
            this.resize();
        }
    }

    private resize() {
        const width = this.boxBody?.nativeElement?.offsetWidth
        if (width && width > 0) {
            this.lyricsWidth = width;
        }
    }

    ngOnDestroy() {
        if (this.paused) {
            return;
        }
        this.audio.pause();
    }

    public tapPrevious() {
        if (!this.canPrevious) {
            return;
        }
        this.index --;
        this.data = this.items[this.index];
    }

    public tapNext() {
        if (!this.canNext) {
            return;
        }
        this.index ++;
        this.data = this.items[this.index];
    }

    public togglePlay() {
        if (!this.paused) {
            this.pause();
            return;
        }
        if (this.data) {
            this.audio.play();
            return;
        }
        this.index = this.nextIndex();
        if (this.index < 0) {
            return;
        }
        this.data = this.items[this.index];
        this.audio.src = this.data.source;
        this.audio.play();
    }

    private nextIndex(): number {
        if (this.items.length < 1) {
            return -1;
        }
        const i = this.index ++;
        if (i >= this.items.length) {
            return 0;
        }
        return i;
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
        this.index = i;
        this.data = this.items[i];
        this.audio.src = this.data.source;
        this.audio.play();
    }
    public pause(): void {
        this.audio.pause();
    }
    public stop(): void {
        this.audio.src = '';
        this.items = [];
        this.index = -1;
        this.data = undefined;
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

    
    public onProgressChange(i: number) {
        this.audio.currentTime = i;
        this.audio.play();
    }

    public toggleSpectrum() {
        this.spectrumVisible = !this.spectrumVisible;
        if (this.spectrumVisible) {
            this.bootSpectrum();
        }
    }

    private bootSpectrum() {
        if (this.spectrumFunc) {
            return;
        }
        const context = new AudioContext();
        const fen = context.createAnalyser();
        const src = context.createMediaElementSource(this.audio);
        src.connect(fen);
        fen.connect(context.destination);
        this.spectrumFunc = () => {
            if (this.paused || !this.spectrumVisible) {
                return;
            }
            const items = new Uint8Array(fen.frequencyBinCount);
            fen.getByteFrequencyData(items);
            this.channelData = [];
            for (let index = 0; index < 200; index++) {
                this.channelData.push(items[index]);
            }
        };
        const cb = () => {
            const handle = window.requestAnimationFrame(() => {
                if (this.spectrumFunc) {
                    this.spectrumFunc();
                    cb();
                    return;
                }
                window.cancelAnimationFrame(handle);
            });
            
        };
        cb();
    }

    public toggleLyrics() {
        this.lyricsVisible = !this.lyricsVisible;
        if (this.lyricsVisible) {
            this.lyricsSrc = this.data.lyrics;
        }
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
}
