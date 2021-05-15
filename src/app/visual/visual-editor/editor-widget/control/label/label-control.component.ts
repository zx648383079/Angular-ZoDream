import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-label-control',
  templateUrl: './label-control.component.html',
  styleUrls: ['./label-control.component.scss']
})
export class LabelControlComponent  {

    @Input() public value: Widget;

    constructor() { }


}
