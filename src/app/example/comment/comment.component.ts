import { Component, OnInit } from '@angular/core';
import { randomInt } from '../../theme/utils';

@Component({
    selector: 'app-example-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class ExampleCommentComponent implements OnInit {

    public commentItems: any = [1, 2, 3];
    public positiveScale = 0;
    public negativeScale = 0;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            const i = randomInt(100, 800);
            const j = randomInt(100, 800);
            const t = i + j;
            this.positiveScale = i * 100 / t;
            this.negativeScale = j * 100 / t;
        }, 2000);
    }

}
