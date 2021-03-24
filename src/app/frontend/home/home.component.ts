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
            url: '/blog'
        },
        {
            name: 'Book',
            url: '/book'
        },
        {
            name: 'Micro',
            url: 'micro'
        },
        {
            name: 'Forum',
            url: 'forum'
        },
        {
            name: 'Video',
            url: '/video'
        },
        {
            name: 'Document',
            url: '/doc'
        },
        {
            name: 'Finance',
            url: '/finance'
        },
        {
            name: 'Disk',
            url: '/disk',
            description: 'ONLINE DISK'
        },
        {
            name: 'Chat',
            url: '/chat'
        },
        {
            name: 'Shop',
            url: '/shop',
        },
        {
            name: 'Task',
            url: '/task'
        },
        {
            name: 'Legwork',
            url: 'legwork'
        },
        {
            name: 'Catering',
            url: '/catering'
        },
        {
            name: 'Backend',
            url: '/backend'
        }
    ];

    constructor() { }

    ngOnInit(): void {
    }

}
