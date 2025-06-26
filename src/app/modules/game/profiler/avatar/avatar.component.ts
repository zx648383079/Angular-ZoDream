import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-profiler-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

    public items: any[] = [
        {
            name: 'test'
        },
        {
            name: 'test2'
        },
        {
            name: 'test5'
        }
    ];
    public modalVisible = false;

    constructor() { }

    ngOnInit() {
    }

    public tapItem(item: any) {
        this.modalVisible = true;
    }

    public modalClose() {
        this.modalVisible = false;
    }
}
