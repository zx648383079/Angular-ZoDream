import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../theme/services';
import { ForumService } from './forum.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-forum',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, OnDestroy {

    private subItems = new Subscription();

    constructor(
        private themeService: ThemeService,
        private router: Router,
        private route: ActivatedRoute,
        private service: ForumService,
    ) {
        this.themeService.titleChanged.next($localize `Forum`);
    }

    ngOnInit() {
        this.subItems.add(
            this.themeService.suggestTextChanged.subscribe(req => {
                this.service.suggestion({keywords: req.text}).subscribe(res => {
                    req.suggest(res);
                });
            })
        );
        this.themeService.suggestQuerySubmitted.subscribe(res => {
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
        this.subItems.unsubscribe();
    }

}
