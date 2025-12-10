import { Component, input, output } from '@angular/core';
import { IForumClassify, IThread } from '../../model';

@Component({
    standalone: false,
    selector: 'app-thread-list-item',
    templateUrl: './thread-list-item.component.html',
    styleUrls: ['./thread-list-item.component.scss']
})
export class ThreadListItemComponent {

    public dropdownVisible = false;
    public readonly value = input<IThread>(undefined);
    public readonly classifyChanged = output<IForumClassify>();
}
