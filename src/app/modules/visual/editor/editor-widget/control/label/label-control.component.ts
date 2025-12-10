import { Component, OnInit, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-label-control',
  templateUrl: './label-control.component.html',
  styleUrls: ['./label-control.component.scss']
})
export class LabelControlComponent  {

    public readonly value = input<Widget>(undefined);

    constructor() { }


}
