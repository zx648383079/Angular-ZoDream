import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
  selector: 'app-pay-result',
  templateUrl: './pay-result.component.html',
  styleUrls: ['./pay-result.component.scss']
})
export class PayResultComponent implements OnInit {

    public log: any;

    constructor() { }

    ngOnInit() {
    }

}
