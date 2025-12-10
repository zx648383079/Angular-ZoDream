import { Component, OnInit, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent  {

    public readonly value = input<Widget>(undefined);

    constructor() { }


}
