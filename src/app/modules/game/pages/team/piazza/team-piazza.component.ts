import { Component, OnInit, inject } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene, IGameTeam } from '../../../model';
import { IPage, IPageQueries } from '../../../../../theme/models/page';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-game-team-piazza',
    templateUrl: './team-piazza.component.html',
    styleUrls: ['./team-piazza.component.scss']
})
export class TeamPiazzaComponent implements IGameScene, OnInit {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public items: IGameTeam[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };
    public modalVisible = false;
    public input = {
        name: ''
    };

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapSubmit() {
        if (emptyValidate(this.input.name)) {
            this.router.toast('请输入队名');
            return;
        }
        this.router.request(GameCommand.TeamCreateOwn, this.input).subscribe(res => {
            this.router.navigateReplace(GameScenePath.Team);
        });
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
        this.router.request(GameCommand.TeamQuery, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameTeam>;
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
