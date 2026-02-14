import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameRouter, IGameScene, IGameTeam } from '../../../model';
import { IPage, IPageQueries } from '../../../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-game-team-piazza',
    templateUrl: './team-piazza.component.html',
    styleUrls: ['./team-piazza.component.scss']
})
export class TeamPiazzaComponent implements IGameScene {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IGameTeam[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    public modalVisible = false;
    public readonly dataForm = form(signal({
        name: ''
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.router.toast('请输入队名');
            return;
        }
        this.router.request(GameCommand.TeamCreateOwn, this.dataForm().value()).subscribe(res => {
            this.router.navigateReplace(GameScenePath.Team);
        });
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
        this.router.request(GameCommand.TeamQuery, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameTeam>;
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
