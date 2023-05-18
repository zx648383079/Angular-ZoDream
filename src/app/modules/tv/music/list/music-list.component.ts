import { Component, OnInit } from '@angular/core';
import { IFilter, IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { IMusicList } from '../../model';

@Component({
    selector: 'app-music-list',
    templateUrl: './music-list.component.html',
    styleUrls: ['./music-list.component.scss']
})
export class MusicListComponent implements OnInit {

    public items: IMusicList[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        category: 0,
    };
    public filterVisible = false;
    public filterItems: IFilter[] = [];
    public sortItems: ISortItem[] = [
        {name: '默认', value: ''},
        {name: '播放量', value: 'play_count', asc: false},
        {name: '评价', value: 'comment', asc: false},
    ];
    public sortKey = '';
    public orderAsc = true;

    constructor() { }

    ngOnInit() {
    }

    public tapBack() {
        history.back();
    }

    public tapSort(item: ISortItem) {
        if (this.sortKey === item.value) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = item.value as string;
            this.orderAsc = !!item.asc;
        }
    }

    public tapFilter(key: string, val: string) {
        this.queries[key] = val;
        for (const item of this.filterItems) {
            if (item.name !== key) {
                continue;
            }
            for (const it of item.items) {
                it.selected = it.value === val;
            }
        }
        this.tapRefresh();
    }


    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        // this.service.movieList(queries).subscribe({
        //     next: res => {
        //         this.items = res.data;
        //         this.hasMore = res.paging.more;
        //         this.total = res.paging.total;
        //         this.searchService.applyHistory(this.queries = queries);
        //         this.isLoading = false;
        //     },
        //     error: () => {
        //         this.isLoading = false;
        //     }
        // });
    }
}
