import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent {

    @Input() public items: any[] = [
        {
            name: '歌曲名',
            artist: '专辑',
            duration: 120,
            active: true
        }
    ];

    constructor() { }

}
