import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-rectangle-control',
  templateUrl: './rectangle-control.component.html',
  styleUrls: ['./rectangle-control.component.scss']
})
export class RectangleControlComponent  {

    @Input() public value: Widget;

    constructor() { }


}
