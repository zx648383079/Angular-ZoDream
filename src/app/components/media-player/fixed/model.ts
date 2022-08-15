export interface IMediaFile {
    source: string;
    name: string;
    cover?: string;
    artist?: string;
    duration?: number;
    active?: boolean;
    lyrics?: string;
}

export enum MediaAction {
    Play,
    Collect,
    Share,
    Download,
    Delete,
}

export interface IMediaActionEvent {
    action: MediaAction;
    data: IMediaFile;
}

export enum SpectrumType {
    Columnar,
    SymmetryColumnar, // 上下对称
    InverseColumnar, // 左右镜像
    Ring,
    SymmetryRing,
    RingLine,
    Polyline,
    InversePolyline,
    PolylineRing,
    InversePolylineRing,
}

export enum PlayerEvents {
    TIME_UPDATE = 'timeupdate',
    ENDED = 'ended',
    PAUSE = 'pause',
    PLAY = 'play',
    STOP = 'stop',
}

export interface PlayerListeners {
    [PlayerEvents.TIME_UPDATE]: () => void;
    [PlayerEvents.ENDED]: (val: string, v: number, ...item: any[]) => void;
    [PlayerEvents.PAUSE]: () => void;
    [PlayerEvents.PLAY]: () => void;
    [PlayerEvents.STOP]: () => void;
}

export interface PlayerEvent {
    play(): void;
    play(item: IMediaFile): void;
    pause(): void;
    stop(): void;
    push(... items: IMediaFile[]): void;
    on<E extends keyof PlayerListeners>(event: E, listener: PlayerListeners[E]): void;
    off<E extends keyof PlayerListeners>(event: E, listener?: PlayerListeners[E] | undefined): void;
    emit<E extends keyof PlayerListeners>(event: E, ...eventObject: Parameters<PlayerListeners[E]>): void;
}