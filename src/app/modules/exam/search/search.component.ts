import { form } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { eachObject, mapFormat, parseNumber } from '../../../theme/utils';
import { ExamService } from '../exam.service';
import { ICourse, IExamPage } from '../model';

@Component({
    standalone: false,
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    private readonly service = inject(ExamService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<any[]>([]);

    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        type: '0',
        course: 0,
    }));
    public readonly typeValue = computed(() => parseNumber(this.queries.type().value()));
    public typeItems = ['试卷', '题目'];
    public courseItems: ICourse[] = [];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.search(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }
}
