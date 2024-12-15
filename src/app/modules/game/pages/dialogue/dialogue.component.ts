import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IGamePeople } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-dialogue',
    templateUrl: './dialogue.component.html',
    styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent {

    public mode = 0;
    public user: IGamePeople;
    public items: string[] = [];
    public message = '';
    private _index = -1;
    private onFinish: Subject<any>;

    constructor() { }

    

    public select(items: string[]): Observable<number> {
        this.onFinish = new Subject<number>();
        this.mode = 1;
        this.items = items;
        return this.onFinish;
    }

    public say(content: string[]|string, user?: IGamePeople): Observable<void> {
        this.onFinish = new Subject<void>();
        this.mode = 2;
        this.user = user;
        this.items = content instanceof Array ? content : [content];
        this._index = -1;
        this.tapNext();
        return this.onFinish;
    }

    public tapSelected(i: number) {
        this.mode = 0;
        return this.onFinish.next(i);
    }

    public tapNext() {
        this._index ++;
        if (this._index >= this.items.length) {
            this.mode = 0;
            this.onFinish.next(0);
            return;
        }
        this.message = this.items[this._index];
    }

}
