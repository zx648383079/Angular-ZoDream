import { Component, input } from '@angular/core';
import { INavLink } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-tab-bar',
    templateUrl: './tab-bar.component.html',
    styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

    public readonly items = input<INavLink[]>([]);

}
