import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { formatHour } from '../../../../theme/utils';
import { IPageEvaluate, IQuestionCard, IQuestionPageItem } from '../../../model';
import { formatPager } from '../../../util';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-page-reader',
  templateUrl: './page-reader.component.html',
  styleUrls: ['./page-reader.component.scss']
})
export class PageReaderComponent implements OnInit {

    public data: IPageEvaluate;
    public cardItems: IQuestionCard[] = [];
    public page = 1;
    public endTime = 0;
    public pageItems: IQuestionPageItem[] = [];
    public current: IQuestionPageItem;

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
        return formatHour(v);
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
