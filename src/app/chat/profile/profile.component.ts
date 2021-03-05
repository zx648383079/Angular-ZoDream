import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFriend } from '../../theme/models/chat';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    @Output() public closed = new EventEmitter();
    @Input() public value: IFriend;

    constructor() { }

    public tapClose() {
        this.closed.emit();
    }

}
