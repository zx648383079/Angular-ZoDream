import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.scss']
})
export class ImageControlComponent  {

    @Input() public value: Widget;

    constructor() { }


}
