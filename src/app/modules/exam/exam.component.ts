import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../theme/services';
import { ExamService } from './exam.service';
import { ICourse } from './model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    styleUrls: ['./exam.component.scss']
})
export class ExamComponent {
    private readonly service = inject(ExamService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);


    public readonly items = signal<ICourse[]>([]);

    constructor() {
        this.themeService.titleChanged.next($localize `Exam`);
        this.themeService.suggestTextChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(req => {
            this.service.suggestion({keywords: req.text}).subscribe(res => {
                req.suggest(res);
            });
        });
        this.themeService.suggestQuerySubmitted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            if (typeof res === 'object') {
                this.router.navigate(['pager', res.id], {relativeTo: this.route});
                return;
            }
            this.router.navigate(['search'], {relativeTo: this.route, queryParams: {keywords: res}});
        });
        this.service.courseChildren().subscribe(res => {
            this.items.set(res.data);
        });
    }

}
