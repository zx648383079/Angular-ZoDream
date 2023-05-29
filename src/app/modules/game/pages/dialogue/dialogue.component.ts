import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent implements OnInit {

    public visible = false;

    constructor() { }

    ngOnInit() {
    }

}
