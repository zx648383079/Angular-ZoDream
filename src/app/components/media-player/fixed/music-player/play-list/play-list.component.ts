import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMediaFile } from '../../model';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent {

    @Input() public items: IMediaFile[] = [];
    @Input() public min = false;
    @Output() public tapped = new EventEmitter<IMediaFile>();

    constructor(
        private service: PlayerService
    ) { }


    public tapItem(item: IMediaFile) {
        this.tapped.emit(item);
    }
}
