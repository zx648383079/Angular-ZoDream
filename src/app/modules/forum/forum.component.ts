import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchEvents } from '../../theme/models/event';
import { SearchService, ThemeService } from '../../theme/services';
import { ForumService } from './forum.service';

@Component({
    standalone: false,
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {

    constructor(
        private themeService: ThemeService,
        private searchService: SearchService,
        private router: Router,
        private route: ActivatedRoute,
        private service: ForumService,
    ) {
        this.themeService.setTitle($localize `Forum`);
    }

    ngOnInit() {
        this.searchService.on(SearchEvents.CHANGE, keywords => {
            return this.service.suggestion({keywords});
        });
        this.searchService.on(SearchEvents.CONFIRM, res => {
            if (typeof res === 'object') {
                this.router.navigate(['thread', res.id], {relativeTo: this.route});
                return;
            }
            this.router.navigate([], {relativeTo: this.route, queryParams: {
                keywords: res
            }});
        });
    }

    ngOnDestroy() {
        this.searchService.offReceiver();
    }

}
