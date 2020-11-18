import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITaskReview } from '../../theme/models/task';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

    public date = '';
    public type = 0;
    public chart = 0;
    public ignore = false;

    public items: ITaskReview[] = [];

    public typeItems = ['按周', '按月'];
    public chartItems = ['表格', '图表'];

    constructor(
        private service: TaskService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tapRefresh();
        });
    }

    public tapSearch(form: any) {
        console.log(form);
    }

    public tapRefresh() {
        this.service.review({
            date: this.date,
            type: this.type,
            ignore: this.ignore
        }).subscribe(res => {
            this.items = res.data;
        });
    }

}
