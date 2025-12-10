import { Component, OnInit, inject } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene, IGameTask } from '../../model';
import { IPage, IPageQueries } from '../../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-game-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements IGameScene, OnInit {
    private router = inject<IGameRouter>(GameRouterInjectorToken);


    public items: IGameTask[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

    ngOnInit(): void {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
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
        this.router.request(GameCommand.TaskOwn, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameTask>;
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
