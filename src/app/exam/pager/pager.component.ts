import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam.service';
import { IExamPager, IQuestionCard, IQuestionFormat } from '../model';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

    public data: IExamPager;
    public items: IQuestionFormat[] = [];
    public finished = false;
    public cardItems: IQuestionCard[] = [];

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.pager({
                id: params.id,
                course: params.course,
                type: params.type,
            }).subscribe(res => {
                this.data = res;
                this.items = res.data;
                this.finished = res.finished;
                this.cardItems = res.data.map((i, j) => {
                    return {
                        order: (j + 1).toString(),
                        id: i.id,
                        right: 0,
                        active: false,
                    };
                });
            });
        });
    }

    public onQuestionChange(event: IQuestionFormat, i: number) {
        this.items[i] = event;
    }
}
