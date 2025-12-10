import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../theme/services';
import { ExamService } from './exam.service';
import { ICourse } from './model';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {
    private service = inject(ExamService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private themeService = inject(ThemeService);


    public items: ICourse[] = [];
    private subItems = new Subscription();

    constructor() {
        this.themeService.titleChanged.next($localize `Exam`);
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
                this.router.navigate(['pager', res.id], {relativeTo: this.route});
                return;
            }
            this.router.navigate(['search'], {relativeTo: this.route, queryParams: {keywords: res}});
        });
        this.service.courseChildren().subscribe(res => {
            this.items = res.data;
        });
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }

}
