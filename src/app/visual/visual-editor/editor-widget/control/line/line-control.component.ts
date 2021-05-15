import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-line-control',
  templateUrl: './line-control.component.html',
  styleUrls: ['./line-control.component.scss']
})
export class LineControlComponent  {

    @Input() public value: Widget;

    constructor() { }

}
