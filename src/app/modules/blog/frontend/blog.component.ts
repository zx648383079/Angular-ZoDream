import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
    private readonly service = inject(BlogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);


    private readonly subItems = new Subscription();

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
