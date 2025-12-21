import { Component, input } from '@angular/core';
import { PanelWidget } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-group-panel',
    templateUrl: './group-panel.component.html',
    styleUrls: ['./group-panel.component.scss']
})
export class GroupPanelComponent  {

    public readonly value = input<PanelWidget>(undefined);


}
