import { Component, DestroyRef, ElementRef,  HostListener, afterNextRender, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { IMediaFile, PlayerEvent, PlayerEvents, PlayerListeners, PlayerLoopMode } from '../model';
import { assetUri, findIndex, randomInt, rangeStep } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-music-player',
    templateUrl: './music-player.component.html',
    styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements PlayerEvent {
    private readonly destroyRef = inject(DestroyRef);

    private readonly boxBody = viewChild<ElementRef<HTMLDivElement>>('playerBar');
    public readonly isFixed = input(true);
    public readonly hidden = input(false);
    public readonly lyricsWidth = signal(0);
    public readonly lyricsHeight = signal(200);
    public readonly catalogVisible = signal(false);
    public readonly lyricsVisible = signal(false);
    public readonly spectrumVisible = signal(false);
    public readonly moreVisible = signal(false);
    public readonly morePanelVisible = signal(false);
    public readonly loop = signal<number>(PlayerLoopMode.LIST);
    public readonly paused = signal(true);
    public readonly booted = signal(false);
    public readonly items = signal<IMediaFile[]>([]);
    public index = -1;
    public readonly data = signal<IMediaFile|null>(null);
    public readonly progress = signal(0);
    public readonly duration = signal(0);
    public readonly loaded = signal(0);
    public readonly volume = signal(100);
    public readonly channelData = signal<number[]>([]);
    public readonly lyricsSrc = signal('');
    private audioElement?: HTMLAudioElement;
    private spectrumFunc?: () => void;
    private volumeLast = 100;
    private listeners: {
        [key: string]: Function[];
    } = {};

    public readonly canPrevious = computed(() => {
        return this.items().length > 1 && this.index > 0;
    });

    public readonly canNext = computed(() => {
        return this.items().length > 1 && this.index < this.items().length - 1;
    });

    private get audio(): HTMLAudioElement {
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.preload = 'auto';
            this.audioElement.crossOrigin = 'anonymous';
            this.bindAudioEvent();
        }
        return this.audioElement;
    }

    public readonly loopTip = computed(() => {
        switch (this.loop()) {
            case PlayerLoopMode.LOOP:
                return '循环播放';
            case PlayerLoopMode.RANDOM:
                return '随机播放';
            case PlayerLoopMode.ONCE:
                return '单曲播放';
            case PlayerLoopMode.ONLY_LOOP:
                return '单曲循环播放';
            default:
                return '顺序播放';
        }
    });

    constructor() {
        effect(() => {
            this.hidden();
            if (this.booted()) {
                this.resize();
            }
        });
        this.destroyRef.onDestroy(() => {
            if (this.paused()) {
                return;
            }
            this.audio.pause();
        });
        afterNextRender({
            write: () => {
                setTimeout(() => {
                    this.resize();
                }, 100);
                this.booted.set(true);
            }
        });
    }

    @HostListener('window:resize')
    public resize() {
        const width = this.boxBody()?.nativeElement?.offsetWidth
        if (!width || width <= 0) {
            return;
        }
        this.lyricsWidth.set(width);
        this.moreVisible.set(width < 769);
    }

    public toggleCatalog() {
        this.catalogVisible.update(v => !v);
    }

    public toggleMore() {
        this.morePanelVisible.update(v => !v);
    }

    public formatAsset(val?: string) {
        return assetUri(val);
    }

    public tapPrevious() {
        if (!this.canPrevious) {
            return;
        }
        this.playTo(this.index - 1);
    }

    public tapNext() {
        if (!this.canNext) {
            return;
        }
        this.playTo(this.index + 1);
    }

    public toggleLoop() {
        let i = this.loop() + 1;
        if (i > 4) {
            i = 0;
        }
        this.loop.set(i);
    }

    public togglePlay() {
        if (!this.paused()) {
            this.pause();
            return;
        }
        if (this.data()) {
            this.audio.play();
            return;
        }
        this.playNext();
    }

    private nextIndex(): number {
        if (this.loop() === PlayerLoopMode.ONCE) {
            return -1;
        }
        if (this.loop() === PlayerLoopMode.ONLY_LOOP) {
            return this.index;
        }
        if (this.items().length <= 1) {
            return this.loop() === PlayerLoopMode.LOOP ? this.index : -1;
        }
        const max = this.items().length - 1;
        if (this.loop() === PlayerLoopMode.RANDOM) {
            const i = randomInt(0, max);
            return i === this.index ? this.checkIndex(i + 1) : i;
        }
        const i = this.index ++;
        if (this.loop() === PlayerLoopMode.LOOP) {
            return this.checkIndex(i);
        }
        if (i >= this.items().length) {
            return -1;
        }
        return i;
    }

    private checkIndex(i: number): number {
        if (i < 0) {
            return this.items().length - 1;
        }
        if (i >= this.items().length) {
            return 0;
        }
        return i;
    }

    private playNext() {
        this.playTo(this.nextIndex());
    }

    private playTo(i: number) {
        if (i < 0) {
            return;
        }
        if (this.index === i) {
            if (this.paused()) {
                this.audio.play();
            }
            return;
        }
        this.index = i;
        this.data.set(this.items()[i]);
        this.audio.src = this.data()!.source;
        this.paused.set(false);
        this.audio.play();
        this.items.update(v => {
            return v.map((item, j) => {
                item.active = i === j;
                return item;
            });
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
        if (i < 0 || i >= this.items().length) {
            return;
        }
        this.playTo(i);
    }
    public pause(): void {
        if (this.paused()) {
            return;
        }
        this.audio.pause();
    }
    public stop(): void {
        if (!this.paused()) {
            this.audio.pause();
        }
        this.audio.src = '';
        this.items.set([]);
        this.index = -1;
        this.data.set(null);
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

    
    public onProgressChange(i: number) {
        this.audio.currentTime = i;
        if (this.paused()) {
            this.audio.play();
        }
    }

    public toggleSpectrum() {
        if (!this.data()) {
            return;
        }
        this.spectrumVisible.update(v => !v);
        if (this.spectrumVisible()) {
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
            if (!this.spectrumVisible()) {
                return;
            }
            if (this.paused()) {
                this.channelData.set([]);
                return;
            }
            const items = new Uint8Array(fen.frequencyBinCount);
            fen.getByteFrequencyData(items);
            this.channelData.set(rangeStep(0, 199, 1, i => items[i]));
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
        if (!this.data()) {
            return;
        }
        this.lyricsVisible.update(v => !v);
        if (this.lyricsVisible()) {
            this.lyricsSrc.set(this.data()?.lyrics!);
        }
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

    public on<E extends keyof PlayerListeners>(event: E, listener: PlayerListeners[E]): void;
    public on(event: string, cb: any) {
        if (!Object.hasOwn(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit<E extends keyof PlayerListeners>(event: E, ...eventObject: Parameters<PlayerListeners[E]>): void;
    public emit(event: string, ...items: any[]) {
        if (!Object.hasOwn(this.listeners, event)) {
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
        if (!Object.hasOwn(this.listeners, event)) {
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
        const audio = this.audioElement!;
        audio.addEventListener('timeupdate', () => {
            this.emit(PlayerEvents.TIME_UPDATE);
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
            if (!this.paused) {
                audio.play();
            }
        })
        audio.addEventListener('canplay', () => {
            this.loaded.set(audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0);
        });
        audio.addEventListener('progress', () => {
            this.loaded.set(audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0);
        });
        audio.addEventListener('ended', () => {
            this.paused.set(true);
            this.emit(PlayerEvents.ENDED);
            this.data.update(v => (<IMediaFile>{...v, active: false}));
            this.playNext();
        });
        audio.addEventListener('error', e => {
            this.paused.set(true);
        });
        audio.addEventListener('pause', () => {
            this.paused.set(true);
            this.emit(PlayerEvents.PAUSE);
        });
        audio.addEventListener('play', () => {
            this.paused.set(false);
            this.data.update(v => (<IMediaFile>{...v, active: true}));
            this.emit(PlayerEvents.PLAY);
        });
        if (this.volume() > 0) {
            this.volume.set(this.audioElement!.volume * 100);
        }
    }
}
