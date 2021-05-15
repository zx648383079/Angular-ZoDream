import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-link-control',
  templateUrl: './link-control.component.html',
  styleUrls: ['./link-control.component.scss']
})
export class LinkControlComponent  {

    @Input() public value: Widget;

    constructor() { }


}
