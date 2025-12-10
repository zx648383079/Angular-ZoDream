import { Component, OnInit, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-rich-text-control',
  templateUrl: './rich-text-control.component.html',
  styleUrls: ['./rich-text-control.component.scss']
})
export class RichTextControlComponent  {

    public readonly value = input<Widget>(undefined);

    constructor() { }


}
