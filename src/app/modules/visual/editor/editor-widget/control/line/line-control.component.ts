import { Component, OnInit, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-line-control',
    templateUrl: './line-control.component.html',
    styleUrls: ['./line-control.component.scss']
})
export class LineControlComponent  {

    public readonly value = input<Widget>(undefined);

}
