import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
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
    private saveHandle = 0;
    private saveData = [];

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
                    this.endTime = (res.start_time > 0 ? res.start_time * 1000 : new Date().getTime()) + res.time * 60000;
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
        if (this.data.id < 1) {
            return;
        }
        this.asyncSave({
            id: event.id,
            answer: event.answer,
            dynamic: event.dynamic,
        });
    }

    private asyncSave(item: any) {
        const indexOf = () => {
            for (let i = this.saveData.length - 1; i >= 0; i--) {
                if (this.saveData[i].id == item.id) {
                    return i;
                }
            }
            return -1;
        };
        if (this.saveHandle > 0) {
            clearTimeout(this.saveHandle);
        }
        const j = indexOf();
        if (j < 0) {
            this.saveData.push(item);
        } else {
            this.saveData[j] = item;
        }
        this.saveHandle = window.setTimeout(() => {
            this.saveHandle = 0;
            if (this.saveData.length < 1) {
                return;
            }
            this.service.pagerSave([...this.saveData], this.data.id, this.data.page_id).subscribe(() => {});
            this.saveData = [];
        }, 500);
    }

    public tapFinish(e?: ButtonEvent) {
        this.finished = true;
        e?.enter();
        this.service.pagerCheck(this.data.data.map(i => {
            return {
                id: i.id,
                answer: i.answer,
                dynamic: i.dynamic
            };
        }), this.data.id, this.data.page_id).subscribe({
            next: res => {
                e?.reset();
                this.data = res;
                this.tapPage(this.page);
            },
            error: err => {
                e?.reset();
                this.finished = false;
                this.toastrService.error(err);
            }
        });
    }
}
