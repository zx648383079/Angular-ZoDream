import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IForumClassify, IThread } from '../../model';

@Component({
    standalone: false,
    selector: 'app-thread-list-item',
    templateUrl: './thread-list-item.component.html',
    styleUrls: ['./thread-list-item.component.scss']
})
export class ThreadListItemComponent {

    public dropdownVisible = false;
    @Input() public value: IThread;
    @Output() public classifyChanged = new EventEmitter<IForumClassify>();
}
