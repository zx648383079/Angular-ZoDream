export interface IMediaFile {
    source: string;
    name: string;
    cover?: string;
    artist?: string;
    duration: number;
    active?: boolean;
    lyrics?: string;
}

export interface PlayerEvent {
    play(): void;
    play(item: IMediaFile): void;
    pause(): void;
    stop(): void;
    push(... items: IMediaFile[]): void;
}