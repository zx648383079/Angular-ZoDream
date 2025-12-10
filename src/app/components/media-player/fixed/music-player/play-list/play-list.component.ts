import { Component, input, output } from '@angular/core';
import { IMediaActionEvent, IMediaFile, MediaAction } from '../../model';

@Component({
    standalone: false,
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent {

    public readonly items = input<IMediaFile[]>([]);
    public readonly min = input(false);
    public readonly height = input(0);
    public readonly tapped = output<IMediaActionEvent>();
    public readonly playing = output<IMediaFile>();

    constructor() { }

    public get boxStyle() {
        if (this.height() > 0) {
            return {
                height: this.height() + 'px',
            };
        }
        return {};
    }

    public tapItem(item: IMediaFile) {
        this.playing.emit(item);
        this.tapped.emit({
            action: MediaAction.Play,
            data: item,
        });
    }
}
