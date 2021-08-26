import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog';
import { ExamService } from '../exam.service';
import { IExamPager, IQuestionCard, IQuestionFormat, IQuestionPageItem } from '../model';
import { formatPager } from '../util';


@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

    public data: IExamPager;
    public finished = false;
    public cardItems: IQuestionCard[] = [];
    public page = 1;
    public endTime = 0;
    public pageItems: IQuestionPageItem[] = [];
    public current: IQuestionPageItem;

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
                    [this.pageItems, this.cardItems] = formatPager(res.data);
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
        this.page = page;
        this.current = this.pageItems[page - 1];
        document.documentElement.scrollTop = 0;
    }

    public onTimeEnd() {
        if (!this.data) {
            return;
        }
        this.tapFinish();
    }

    public tapItem(i: number) {
        const card = this.cardItems[i];
        this.tapPage(card.page);
    }

    public onQuestionChange(event: IQuestionFormat, i: number) {
        this.current.items[i].answer = event.answer;
        this.current.items[i].option = event.option;
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
        }), this.data.page_id).subscribe(res => {
            this.data = res;
            this.tapPage(this.page);
        });
    }
}
