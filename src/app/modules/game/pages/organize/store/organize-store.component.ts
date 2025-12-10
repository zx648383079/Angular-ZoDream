import { Component, OnInit, inject } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameItem, IGameRouter, IGameScene, ItemTypeItems } from '../../../model';
import { IPageQueries, IPage } from '../../../../../theme/models/page';

@Component({
    standalone: false,
  selector: 'app-game-organize-store',
  templateUrl: './organize-store.component.html',
  styleUrls: ['./organize-store.component.scss']
})
export class OrganizeStoreComponent implements IGameScene, OnInit {
    private router = inject<IGameRouter>(GameRouterInjectorToken);


    public items: IGameItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        type: 0,
    };
    public modalVisible = false;
    public typeItems = ItemTypeItems;

    ngOnInit(): void {
        this.tapType(0);
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapType(i: number) {
        this.queries.type = i;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.router.request(GameCommand.OrganizeStoreQuery, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameItem>;
                this.queries = queries;
                this.isLoading = false;
                this.total = data.paging.total;
                this.hasMore = data.paging.more;
            },
            error: () => {
                this.isLoading = false;
            }
        })
    }

}
