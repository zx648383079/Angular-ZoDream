import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../theme/services';
import { BlogService } from './blog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
    private readonly service = inject(BlogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.themeService.suggestTextChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(req => {
            this.service.suggestion({keywords: req.text}).subscribe(res => req.suggest(res));
        });
        this.themeService.suggestQuerySubmitted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            if (typeof res === 'object') {
                this.router.navigate([res.id], {relativeTo: this.route});
                return;
            }
            this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
                keywords: res
            }});
        });
    }
}
