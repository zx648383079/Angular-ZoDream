import { Component, OnInit } from '@angular/core';
import { DialogAnimation } from '../theme/constants/dialog-animation';

@Component({
    selector: 'app-catering',
    templateUrl: './catering.component.html',
    styleUrls: ['./catering.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class CateringComponent implements OnInit {

    public dialogOpen = false;

    constructor() { }

    ngOnInit() {
    }

}
