import { Component, OnInit, inject, viewChild } from '@angular/core';
import { MoviePlayerComponent } from '../../../components/media-player';
import { PlayerEvent } from '../../../components/media-player/fixed/model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
    private readonly service = inject(TvService);


    public readonly player = viewChild(MoviePlayerComponent);

    ngOnInit() {
        this.service.liveList().subscribe(res => {
            this.player().push(...res.data.map(i => {
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
