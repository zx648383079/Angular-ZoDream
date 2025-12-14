import { Component, OnInit, inject } from '@angular/core';
import { IPage, IPageQueries } from '../../../../theme/models/page';
import { GameCommand, GameRouterInjectorToken, IGameBagItem, IGameRouter, IGameScene, ItemTypeItems } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-bag',
    templateUrl: './bag.component.html',
    styleUrls: ['./bag.component.scss']
})
export class BagComponent implements IGameScene, OnInit {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public items: IGameBagItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        type: 0,
    };
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
        this.router.request(GameCommand.BagQuery, queries).subscribe({
            next: res => {
                const data = res.data;
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
