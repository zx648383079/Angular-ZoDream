import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMediaActionEvent, IMediaFile, MediaAction } from '../../model';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent {

    @Input() public items: IMediaFile[] = [];
    @Input() public min = false;
    @Input() public height = 0;
    @Output() public tapped = new EventEmitter<IMediaActionEvent>();
    @Output() public playing = new EventEmitter<IMediaFile>();

    constructor(
    ) { }

    public get boxStyle() {
        if (this.height > 0) {
            return {
                height: this.height + 'px',
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
