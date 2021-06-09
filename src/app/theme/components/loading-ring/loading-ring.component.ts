import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-ring',
  templateUrl: './loading-ring.component.html',
  styleUrls: ['./loading-ring.component.scss']
})
export class LoadingRingComponent {

    @Input() public ringName = 'loading-ring1';

    constructor() { }

}
