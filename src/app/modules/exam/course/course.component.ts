import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchEvents } from '../../../theme/models/event';
import { SearchService } from '../../../theme/services';
import { ExamService } from '../exam.service';
import { ICourse } from '../model';

@Component({
    standalone: false,
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

    public data: ICourse;
    public items: ICourse[] = [];

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.searchService.on(SearchEvents.CHANGE, keywords => {
            return this.service.suggestion({keywords, course: this.data.id});
        });
        this.searchService.on(SearchEvents.CONFIRM, res => {
            if (typeof res === 'object') {
                this.router.navigate(['../pager', res.id], {relativeTo: this.route});
                return;
            }
            this.router.navigate(['../search'], {relativeTo: this.route, queryParams: {keywords: res, course: this.data.id}});
        });
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
        this.searchService.offReceiver();
    }

}
