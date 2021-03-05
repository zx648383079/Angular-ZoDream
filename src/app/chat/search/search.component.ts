import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPage } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { COMMAND_FRIEND_SEARCH, IRequest } from '../http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnChanges {

    @Input() public request: IRequest;
    @Output() public closed = new EventEmitter();
    public isInput = false;
    public keywords = '';
    public items = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.request) {
            this.request.on(COMMAND_FRIEND_SEARCH, (res: IPage<IUser>) => {
                this.items = res.data;
            });
        }
    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.request.emit(COMMAND_FRIEND_SEARCH);
    }

    public tapInput() {
        this.isInput = true;
    }

    public tapClear() {
        this.keywords = '';
        this.isInput = false;
    }

    public tapClose() {
        this.closed.emit();
    }
}
