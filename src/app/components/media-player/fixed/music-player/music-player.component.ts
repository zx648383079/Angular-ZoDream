import { Component } from '@angular/core';
import { IMediaFile, PlayerEvent } from '../model';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements PlayerEvent {

    public openCatalog = false;

    constructor() { }

    public play(): void;
    public play(item: IMediaFile): void;
    public play(item?: unknown): void {
        throw new Error('Method not implemented.');
    }
    public pause(): void {
        throw new Error('Method not implemented.');
    }
    public stop(): void {
        throw new Error('Method not implemented.');
    }
    public push(...items: IMediaFile[]): void {
        throw new Error('Method not implemented.');
    }

}
