import { Component, OnInit, ViewChild } from '@angular/core';
import { MoviePlayerComponent } from '../../../components/media-player';
import { PlayerEvent } from '../../../components/media-player/fixed/model';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {

    @ViewChild(MoviePlayerComponent)
    public player: PlayerEvent;

    constructor(
        private service: TvService,
    ) { }

    ngOnInit() {
        this.service.liveList().subscribe(res => {
            this.player.push(...res.data.map(i => {
                return {
                    name: i.title,
                    source: i.source,
                    cover: i.thumb,
                    duration: -1,
                };
            }));
        });
    }

}
