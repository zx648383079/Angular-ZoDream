import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { GameCommand, GameRouterInjectorToken, IGameBagItem, IGameRouter, IGameScene, ItemTypeItems } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-bag',
    templateUrl: './bag.component.html',
    styleUrls: ['./bag.component.scss']
})
export class BagComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IGameBagItem[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        type: 0,
    }));
    public typeItems = ItemTypeItems;

    constructor() {
        this.tapType(0);
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapType(i: number) {
        this.queries.type().value.set(i);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.router.request(GameCommand.BagQuery, queries).subscribe({
            next: res => {
                const data = res.data;
                this.queries().value.set(queries);
                this.isLoading.set(false);
                this.total.set(data.paging.total);
                this.hasMore = data.paging.more;
            },
            error: () => {
                this.isLoading.set(false);
            }
        })
    }

}
