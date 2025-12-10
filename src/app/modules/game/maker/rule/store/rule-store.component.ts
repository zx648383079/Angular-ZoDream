import { Component, OnInit, inject } from '@angular/core';
import { IGameItem, IGameStoreItem } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { GameMakerService } from '../../game-maker.service';

@Component({
    standalone: false,
  selector: 'app-maker-rule-store',
  templateUrl: './rule-store.component.html',
  styleUrls: ['./rule-store.component.scss']
})
export class RuleStoreComponent implements OnInit {
    private service = inject(GameMakerService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IGameStoreItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0
    };
    public editData: IGameItem = {} as any;

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project = parseNumber(params.game);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IGameStoreItem) {
        this.editData = item ? {...item} : {} as any;
        modal.open(() => {
            this.service.storeSave({...this.editData, project_id: this.queries.project}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
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
        this.service.storeList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['project']);
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

    public tapRemove(item: IGameStoreItem) {
        this.toastrService.confirm('确定删除“' + item.name + '”物品？', () => {
            // this.service.forumRemove(item.id).subscribe(res => {
            //     if (!res.data) {
            //         return;
            //     }
            //     this.toastrService.success($localize `Delete Successfully`);
            //     this.items = this.items.filter(it => {
            //         return it.id !== item.id;
            //     });
            // });
        });
    }
}
