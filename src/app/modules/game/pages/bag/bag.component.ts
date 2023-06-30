import { Component, Inject } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    selector: 'app-game-bag',
    templateUrl: './bag.component.html',
    styleUrls: ['./bag.component.scss']
})
export class BagComponent implements IGameScene {

    public items: any[] = [1,1,1,1,1];
    public hasMore = true;
    public isLoading = false;
    public total = 100;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

    constructor(
        @Inject(GameRouterInjectorToken) private router: IGameRouter,
    ) { }

    public tapBack() {
        this.router.navigateBack();
    }

    public tapPage() {

    }

}
