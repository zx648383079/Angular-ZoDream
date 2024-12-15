import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { formatHour } from '../../../../../theme/utils';
import { IPageEvaluate, IQuestionCard, IQuestionFormat, IQuestionPageItem } from '../../../model';
import { formatPager } from '../../../util';
import { ExamService } from '../../exam.service';

@Component({
    standalone: false,
  selector: 'app-page-scoring',
  templateUrl: './page-scoring.component.html',
  styleUrls: ['./page-scoring.component.scss']
})
export class PageScoringComponent implements OnInit {

    @ViewChild('modal')
    public modal: DialogEvent;

    public data: IPageEvaluate;
    public cardItems: IQuestionCard[] = [];
    public page = 1;
    public endTime = 0;
    public pageItems: IQuestionPageItem[] = [];
    public current: IQuestionPageItem;
    public editData = {
        remark: '',
    };

    constructor(
        private service: ExamService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.id > 0) {
                this.loadData(params.id);
            }
        });
    }

    public get formatScale() {
        if (!this.data) {
            return '--';
        }
        return this.data.right * this.data.page.question_count;
    }

    public formatHour(v: number) {
        return formatHour(v, undefined, true);
    }

    public onScoring(i: number, e: IQuestionFormat) {
        this.current.items[i].log = e.log;
        this.service.pageQuestionScoring({
            id: this.data.id,
            question: [
                {
                    id: e.id,
                    score: e.log.score,
                    remark: e.log.remark,
                }
            ]
        }).subscribe(() => {});
    }

    public tapSubmit(e?: ButtonEvent) {
        this.modal.open(() => {
            e?.enter();
            this.service.pageScoring({
                id: this.data.id,
                remark: this.editData.remark
            }).subscribe({
                next: () => {
                    this.toastrService.success('阅卷完成');
                    e?.reset();
                    history.back();
                },
                error: err => {
                    this.toastrService.error(err);
                    e?.reset();
                }
            });
        });
    }

    private loadData(id: any) {
        this.service.evaluate(id).subscribe({
            next: res => {
                this.data = res;
                [this.pageItems, this.cardItems] = formatPager(res.data);
                this.tapPage(1);
            },
            error: err => {
                this.toastrService.error(err);
            }
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
        this.current = this.pageItems.length >= page ? this.pageItems[page - 1] : {items: []} as any;
        document.documentElement.scrollTop = 0;
    }
    
    public tapItem(i: number) {
        const card = this.cardItems[i];
        this.tapPage(card.page);
    }

}
