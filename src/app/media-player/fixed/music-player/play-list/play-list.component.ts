import { Component, Input } from '@angular/core';
import { IMediaFile } from '../../model';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent {

    @Input() public items: IMediaFile[] = [
        {
            name: '歌曲名',
            artist: '专辑',
            duration: 120,
            active: true
        }
    ];

    @Input() public min = false;

    constructor(
        private service: PlayerService
    ) { }


}
