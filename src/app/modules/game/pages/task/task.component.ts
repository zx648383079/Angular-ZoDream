import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene, IGameTask } from '../../model';
import { IPage, IPageQueries } from '../../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-game-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IGameTask[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));

    constructor() {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
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
        this.router.request(GameCommand.TaskOwn, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameTask>;
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
