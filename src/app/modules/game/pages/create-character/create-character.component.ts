import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game-create-character',
    templateUrl: './create-character.component.html',
    styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent implements OnInit {

    public step = 0;

    constructor() { }

    ngOnInit() {
    }

}
