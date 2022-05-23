import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-rich-text-control',
  templateUrl: './rich-text-control.component.html',
  styleUrls: ['./rich-text-control.component.scss']
})
export class RichTextControlComponent  {

    @Input() public value: Widget;

    constructor() { }


}
