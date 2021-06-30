import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../dialog';
import { IPageQueries } from '../../theme/models/page';
import { applyHistory, getQueries } from '../../theme/query';
import { eachObject, mapFormat } from '../../theme/utils';
import { ExamService } from '../exam.service';
import { ICourse, IExamPage } from '../model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    public items: any[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        type: 0,
        course: 0,
    };
    public typeItems = ['试卷', '题目'];
    public courseItems: ICourse[] = [];

    constructor(
        private service: ExamService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public formatQuestionType(value: number) {
        return mapFormat(value, ['单选题', '多选题', '判断题', '简答题', '填空题']);
    }

    public formatEasiness(val: number) {
        if (val < 4) {
            return '简单';
        }
        if (val < 7) {
            return '一般';
        }
        return '困难';
    }

    public formatQuestionCount(item: IExamPage) {
        if (item.rule_type > 0) {
            return item.rule_value.length;
        }
        let count = 0;
        item.rule_value.forEach(i => {
            eachObject(i.type, v => {
                count += v;
            });
        });
        return count;
    }

    /**
     * tapRefresh
     */
     public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.search(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }
}
