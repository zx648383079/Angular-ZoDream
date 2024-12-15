import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent implements OnInit {

    constructor(
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('可视化编辑');
    }

    ngOnInit() {
    }

}
