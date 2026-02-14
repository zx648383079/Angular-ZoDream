import { Component, inject } from '@angular/core';
import { ThemeService } from '../../theme/services';
import { environment } from '../../../environments/environment';
import { DialogService } from '../../components/dialog';

interface IMetaLink {
    name: string;
    url: string;
    description?: string;
}

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly themeService = inject(ThemeService);
    private readonly toastrService = inject(DialogService);


    public linkItems: IMetaLink[] = [
        {
            name: $localize `Example`,
            url: '/example'
        },
        {
            name: $localize `Blog`,
            url: 'blog'
        },
        {
            name: $localize `Blog(SPA)`,
            url: '/blog'
        },
        {
            name: $localize `Book`,
            url: '/book'
        },
        {
            name: $localize `Micro`,
            url: 'micro'
        },
        {
            name: $localize `Note`,
            url: 'note'
        },
        {
            name: $localize `Forum`,
            url: 'forum'
        },
        {
            name: $localize `Navigation`,
            url: '/navigation'
        },
        {
            name: $localize `Video`,
            url: '/video'
        },
        {
            name: $localize `App Store`,
            url: '/app'
        },
        {
            name: $localize `Resource Store`,
            url: '/res'
        },
        {
            name: $localize `TV`,
            url: '/tv'
        },
        {
            name: $localize `Document`,
            url: '/doc'
        },
        {
            name: $localize `Exam`,
            url: 'exam'
        },
        {
            name: $localize `Finance`,
            url: '/finance'
        },
        {
            name: $localize `Disk`,
            url: '/disk',
            description: $localize `ONLINE DISK`
        },
        {
            name: $localize `Chat`,
            url: '/chat'
        },
        {
            name: $localize `Shop`,
            url: '/shop',
        },
        {
            name: $localize `Task`,
            url: '/task'
        },
        {
            name: $localize `Legwork`,
            url: 'legwork'
        },
        {
            name: $localize `Short Link`,
            url: 'short'
        },
        {
            name: $localize `Trade Tracker`,
            url: 'tracker'
        },
        {
            name: $localize `Catering`,
            url: '/catering'
        },
        {
            name: $localize `Game Maker`,
            url: '/game'
        },
        {
            name: $localize `Game Profiler`,
            url: '/game/profiler'
        },
        {
            name: $localize `Visual`,
            url: '/visual'
        },
        {
            name: $localize `Bot`,
            url: '/bot'
        },
        
    ];

    constructor() {
        this.themeService.titleChanged.next($localize `Home`);
        if (!environment.production) {
            this.linkItems.push({
                name: $localize `Generator`,
                url: '/gzo'
            }, {
                name: $localize `Backend`,
                url: '/backend'
            });
        }
    }

}
