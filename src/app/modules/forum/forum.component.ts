import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../theme/services';
import { ForumService } from './forum.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-forum',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.scss']
})
export class ForumComponent {
    private readonly themeService = inject(ThemeService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(ForumService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.themeService.titleChanged.next($localize `Forum`);
        this.themeService.suggestTextChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(req => {
            this.service.suggestion({keywords: req.text}).subscribe(res => {
                req.suggest(res);
            });
        });
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

}
