import { Component, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

    public readonly items = signal<any[]>([
        {
            name: 'test'
        },
        {
            name: 'test2'
        },
        {
            name: 'test5'
        }
    ]);
    public modalVisible = false;

    constructor() {
    }

    public tapItem(item: any) {
        this.modalVisible = true;
    }

    public modalClose() {
        this.modalVisible = false;
    }
}
