import { Component, input, output, signal } from '@angular/core';
import { IForumClassify, IThread } from '../../model';

@Component({
    standalone: false,
    selector: 'app-thread-list-item',
    templateUrl: './thread-list-item.component.html',
    styleUrls: ['./thread-list-item.component.scss']
})
export class ThreadListItemComponent {

    public readonly dropdownVisible = signal(false);
    public readonly value = input.required<IThread>();
    public readonly classifyChanged = output<IForumClassify>();


    public toggleDrop() {
        this.dropdownVisible.update(v => !v);
    }
}
