import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameItem, IGameRouter, IGameScene, ItemTypeItems } from '../../../model';
import { IPageQueries, IPage } from '../../../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-game-organize-store',
    templateUrl: './organize-store.component.html',
    styleUrls: ['./organize-store.component.scss']
})
export class OrganizeStoreComponent implements IGameScene, OnInit {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IGameItem[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        type: 0,
    }));
    public modalVisible = false;
    public typeItems = ItemTypeItems;

    ngOnInit(): void {
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
        this.router.request(GameCommand.OrganizeStoreQuery, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameItem>;
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
