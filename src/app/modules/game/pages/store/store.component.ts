import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';

@Component({
    selector: 'app-game-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

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

    ngOnInit() {
    }

    public tapBack() {

    }

    public tapPage() {

    }
}
