import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../theme/services';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

    constructor(
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('活动中心');
    }

    ngOnInit() {
    }

}
