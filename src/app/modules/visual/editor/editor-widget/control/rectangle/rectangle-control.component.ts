import { Component, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-rectangle-control',
    templateUrl: './rectangle-control.component.html',
    styleUrls: ['./rectangle-control.component.scss']
})
export class RectangleControlComponent  {

    public readonly value = input<Widget>(undefined);

}
