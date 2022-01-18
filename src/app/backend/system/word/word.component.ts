import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IBlackWord } from '../../../theme/models/seo';
import { applyHistory, getQueries } from '../../../theme/query';
import { emptyValidate } from '../../../theme/validators';
import { SystemService } from '../system.service';

@Component({
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
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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
                applyHistory(this.queries = queries);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IBlackWord) {
        this.toastrService.confirm('确定删除“' + item.words + '”屏蔽词？', () => {
            this.service.wordRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
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
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.words));
    }

}
