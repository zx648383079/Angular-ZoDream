import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { IWord } from '../../model';
import { OnlineBackendService } from '../online.service';

@Component({
    standalone: false,
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {

    public items: IWord[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        category: 0,
    };
    public editData: IWord;

    constructor(
        private service: OnlineBackendService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.category) {
                this.queries.category = parseInt(params.category, 10);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IWord) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            content: '',
            cat_id: this.queries.category,
        };
        modal.open(() => {
            this.service.wordSave(this.editData).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.content));
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.wordList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: IWord) {
        this.toastrService.confirm('确定删除“' + item.content + '”？', () => {
            this.service.wordRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }


}
