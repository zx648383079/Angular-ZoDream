import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme/services';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

    constructor(
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('圈子');
    }

    ngOnInit(): void {
    }

}
