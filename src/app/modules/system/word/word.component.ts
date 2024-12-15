import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IBlackWord } from '../../../theme/models/seo';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { SystemService } from '../system.service';

@Component({
    standalone: false,
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {

    public items: IBlackWord[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public editData: IBlackWord = {} as any;

    constructor(
        private service: SystemService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
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

    /**
     * goPage
     */
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IBlackWord) {
        this.toastrService.confirm('确定删除“' + item.words + '”屏蔽词？', () => {
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

    open(modal: DialogBoxComponent, item?: IBlackWord) {
        this.editData = item ? {...item} : {id: 0, words: '', replace_words: ''};
        modal.open(() => {
            this.service.wordSave(Object.assign({}, this.editData)).subscribe(res => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.words));
    }

}
