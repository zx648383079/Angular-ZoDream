import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game-organize',
    templateUrl: './organize.component.html',
    styleUrls: ['./organize.component.scss']
})
export class OrganizeComponent implements OnInit {

    public tabIndex = 0;
    public modalVisible = false;

    constructor() { }

    ngOnInit() {
    }

        
    public tapBack() {

    }
}
