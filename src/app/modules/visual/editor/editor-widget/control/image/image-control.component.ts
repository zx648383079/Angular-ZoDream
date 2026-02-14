import { Component, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-image-control',
    templateUrl: './image-control.component.html',
    styleUrls: ['./image-control.component.scss']
})
export class ImageControlComponent  {

    public readonly value = input<Widget>(undefined);


}
