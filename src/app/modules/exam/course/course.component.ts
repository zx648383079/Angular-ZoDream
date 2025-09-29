import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../theme/services';
import { ExamService } from '../exam.service';
import { ICourse } from '../model';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

    public data: ICourse;
    public items: ICourse[] = [];
    private subItems = new Subscription();

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
        private themeService: ThemeService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.subItems.add(
            this.themeService.suggestTextChanged.subscribe(req => {
                this.service.suggestion({keywords: req.text, course: this.data.id}).subscribe(res => {
                    req.suggest(res);
                });
            })
        );
        this.subItems.add(
            this.themeService.suggestQuerySubmitted.subscribe(res => {
                if (typeof res === 'object') {
                    this.router.navigate(['../pager', res.id], {relativeTo: this.route});
                    return;
                }
                this.router.navigate(['../search'], {relativeTo: this.route, queryParams: {keywords: res, course: this.data.id}});
            })
        );
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.course(params.id).subscribe(res => {
                this.data = res;
            });
        });
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
    }

}
