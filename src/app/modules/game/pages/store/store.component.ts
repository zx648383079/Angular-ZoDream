import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { IGameScene } from '../../model';

@Component({
    selector: 'app-game-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.scss']
})
export class StoreComponent implements IGameScene {

    public items: any[] = [1,1,1,1,1];
    public hasMore = true;
    public isLoading = false;
    public total = 100;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };
    public modalVisible = false;

    constructor() { }

    public tapBack() {

    }

    public tapPage() {

    }
}
