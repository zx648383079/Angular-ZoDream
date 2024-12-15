import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-carousel-control',
  templateUrl: './carousel-control.component.html',
  styleUrls: ['./carousel-control.component.scss']
})
export class CarouselControlComponent {

    @Input() public value: Widget;

    constructor() { }

}
