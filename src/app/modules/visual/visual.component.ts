import { Component, inject } from '@angular/core';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
    selector: 'app-visual',
    templateUrl: './visual.component.html',
    styleUrls: ['./visual.component.scss']
})
export class VisualComponent {
    private readonly themeService = inject(ThemeService);


    constructor() {
        this.themeService.titleChanged.next('可视化编辑');
    }

}
