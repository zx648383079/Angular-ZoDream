import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent  {

    @Input() public value: Widget;

    constructor() { }


}
