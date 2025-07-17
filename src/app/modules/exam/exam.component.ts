import { Component, OnDestroy, OnInit } from '@angular/core';
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

    public items: ICourse[] = [];
    private subItems: Subscription[] = [];

    constructor(
        private service: ExamService,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService,
    ) {
        this.themeService.titleChanged.next($localize `Exam`);
    }
  
    ngOnInit() {
        this.subItems.push(
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
        for (const item of this.subItems) {
            item.unsubscribe();
        }
    }

}
