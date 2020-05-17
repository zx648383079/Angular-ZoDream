import { Component, OnInit } from '@angular/core';

interface ILink {
    name: string;
    url: string;
    description?: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public title = 'Home';

    public links: ILink[] = [
        {
            name: 'Blog',
            url: 'blog'
        },
        {
            name: 'Disk',
            url: '/disk',
            description: 'ONLINE DISK'
        }
    ];

    constructor() { }

    ngOnInit(): void {
    }

}
