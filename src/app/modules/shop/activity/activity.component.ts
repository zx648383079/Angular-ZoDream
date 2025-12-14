import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
    private readonly themeService = inject(ThemeService);


    constructor() {
        this.themeService.titleChanged.next('活动中心');
    }

    ngOnInit() {
    }

}
