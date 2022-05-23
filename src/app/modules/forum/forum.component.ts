import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, ThemeService } from '../../theme/services';
import { ForumService } from './forum.service';

@Component({
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
        this.searchService.on('change', keywords => {
            return this.service.suggestion({keywords});
        }).on('confirm', res => {
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
