import { Component, Inject, OnInit } from '@angular/core';
import { GameCommand, GameRouterInjectorToken, GameScenePath, IGameOrganize, IGameRouter, IGameScene } from '../../../model';
import { IPage, IPageQueries } from '../../../../../theme/models/page';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    selector: 'app-game-organize-piazza',
    templateUrl: './organize-piazza.component.html',
    styleUrls: ['./organize-piazza.component.scss']
})
export class OrganizePiazzaComponent implements IGameScene, OnInit {

    public items: IGameOrganize[] = [];
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
        name: '',

    };

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapSubmit() {
        if (emptyValidate(this.input.name)) {
            this.router.toast('名称不能为空');
            return;
        }
        this.router.request(GameCommand.OrganizeCreateOwn, this.input).subscribe(res => {
            this.router.navigateReplace(GameScenePath.Organize);
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
        this.router.request(GameCommand.OrganizeQuery, queries).subscribe({
            next: res => {
                const data = res.data as IPage<IGameOrganize>;
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
