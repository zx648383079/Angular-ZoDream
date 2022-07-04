import { Component } from '@angular/core';
import { formatHour } from '../../../theme/utils';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {

    public paused = true;
    public progress = 0;
    public duration = 0;
    public volume = 100;
    public isFull = false;
    public volumeVisible = false;
    private volumeLast = 100;

    constructor() { }


    public formatTime(v: number) {
        return formatHour(v, undefined, true);
    }

    public onProgressChange(v: number) {
        this.progress = v;
    }

    public toggleVolume() {
        this.volumeVisible = !this.volumeVisible;
    }
}
