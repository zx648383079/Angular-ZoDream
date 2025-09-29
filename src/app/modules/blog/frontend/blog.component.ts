import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../theme/services';
import { BlogService } from './blog.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

    private subItems = new Subscription();

    constructor(
        private service: BlogService,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService,
    ) {
    }

    ngOnInit() {
        this.subItems.add(
            this.themeService.suggestTextChanged.subscribe(req => {
                this.service.suggestion({keywords: req.text}).subscribe(res => req.suggest(res));
            })
        );
        this.subItems.add(
            this.themeService.suggestQuerySubmitted.subscribe(res => {
                if (typeof res === 'object') {
                    this.router.navigate([res.id], {relativeTo: this.route});
                    return;
                }
                this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
                    keywords: res
                }});
            })
        );
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }
}
