import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchEvents } from '../../../theme/models/event';
import { SearchService } from '../../../theme/services';
import { BlogService } from './blog.service';

@Component({
    standalone: false,
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

    constructor(
        private searchService: SearchService,
        private service: BlogService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.searchService.on(SearchEvents.CHANGE, keywords => {
            return this.service.suggestion({keywords});
        });
        this.searchService.on(SearchEvents.CONFIRM, res => {
            if (typeof res === 'object') {
                this.router.navigate([res.id], {relativeTo: this.route});
                return;
            }
            this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
                keywords: res
            }});
        });
    }

    ngOnDestroy() {
        this.searchService.offReceiver();
    }
}
