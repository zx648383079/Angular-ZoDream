import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, ThemeService } from '../theme/services';
import { ExamService } from './exam.service';
import { ICourse } from './model';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {

    public items: ICourse[] = [];

    constructor(
        private service: ExamService,
        private searchService: SearchService,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Exam`);
    }
  
    ngOnInit() {
        this.searchService.on('change', keywords => {
            return this.service.suggestion({keywords});
        }).on('confirm', res => {
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
        this.searchService.offReceiver();
    }

}
