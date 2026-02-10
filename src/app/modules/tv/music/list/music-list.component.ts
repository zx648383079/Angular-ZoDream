import { form } from '@angular/forms/signals';
import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IFilter, IPageQueries } from '../../../../theme/models/page';
import { ISortItem } from '../../../../theme/models/seo';
import { IMusicList } from '../../model';

@Component({
    standalone: false,
    selector: 'app-music-list',
    templateUrl: './music-list.component.html',
    styleUrls: ['./music-list.component.scss']
})
export class MusicListComponent {

    private readonly location = inject(Location);
    
    public readonly items = signal<IMusicList[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        category: 0,
    }));
    public readonly filterVisible = signal(false);
    public readonly filterItems = signal<IFilter[]>([]);
    public sortItems: ISortItem[] = [
        {name: '默认', value: ''},
        {name: '播放量', value: 'play_count', asc: false},
        {name: '评价', value: 'comment', asc: false},
    ];
    public readonly sortKey = signal('');
    public readonly orderAsc = signal(true);

    public tapBack() {
        this.location.back();
    }

    public toggleFilter() {
        this.filterVisible.update(v => !v);
    }

    public tapSort(item: ISortItem) {
        if (this.sortKey() === item.value) {
            this.orderAsc.update(v => !v);
        } else {
            this.sortKey.set(item.value as string);
            this.orderAsc.set(!!item.asc);
        }
    }

    public tapFilter(key: string, val: string) {
        this.queries().value.update(v => {
            v[key] = val;
            return v;
        })
        for (const item of this.filterItems()) {
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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        // this.service.movieList(queries).subscribe({
        //     next: res => {
        //         this.items.set(res.data);
        //         this.hasMore = res.paging.more;
        //         this.total.set(res.paging.total);
        //         this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        //         this.isLoading.set(false);
        //     },
        //     error: () => {
        //         this.isLoading.set(false);
        //     }
        // });
    }
}
