import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog';
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
    public total = 0;
    public page = 1;
    public perPage = 10;
    public endTime = 0;

    constructor(
        private service: ExamService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.pager({
                id: params.id || 0,
                course: params.course,
                type: params.type,
            }).subscribe({
                next: res => {
                    this.data = res;
                    this.finished = res.finished;
                    this.cardItems = res.data.map((i, j) => {
                        return {
                            order: (j + 1).toString(),
                            id: i.id,
                            right: 0,
                            active: false,
                        };
                    });
                    this.total = Math.ceil(res.data.length / this.perPage);
                    this.tapPage(1);
                    this.endTime = new Date().getTime() + res.time * 60000;
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }

    public tapPrevious() {
        this.tapPage(this.page - 1);
    }

    public tapNext() {
        this.tapPage(this.page + 1);
    }

    public tapPage(page: number) {
        if (page > this.total) {
            page = this.total;
        }
        if (page < 1) {
            page = 1;
        }
        const items = [];
        let start = (page - 1) * this.perPage;
        const end = Math.min(start + this.perPage, this.data.data.length);
        for (; start < end; start ++) {
            items.push(this.data.data[start]);
        }
        this.items = items;
        this.page = page;
        document.documentElement.scrollTop = 0;
    }

    public onTimeEnd() {
        if (!this.data) {
            return;
        }
        this.tapFinish();
    }

    public tapItem(i: number) {
        this.tapPage(Math.floor(i / this.perPage));
    }

    public onQuestionChange(event: IQuestionFormat, i: number) {
        this.items[i].answer = event.answer;
        this.items[i].option = event.option;
    }

    public tapFinish() {
        this.finished = true;
        const spentTime = Math.min(this.data.time, this.data.time - (this.endTime - new Date().getTime()) / 60000)
        this.service.pagerCheck(this.data.data.map(i => {
            return {
                id: i.id,
                answer: i.answer,
                dynamic: i.dynamic
            };
        }), this.data.id).subscribe(res => {
            this.data = res;
            this.tapPage(this.page);
        });
    }
}
