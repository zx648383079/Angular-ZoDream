import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IForum } from '../../model';
import { ForumService } from '../forum.service';

@Component({
    standalone: false,
    selector: 'app-forum-b-list',
    templateUrl: './forum-list.component.html',
    styleUrls: ['./forum-list.component.scss']
})
export class ForumListComponent {
    private readonly service = inject(ForumService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IForum[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        parent: 0,
    }));
    public readonly parent = signal<IForum>(null);

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            const parent = this.queries.parent().value();
            if (parent < 1 || this.parent()?.id === parent) {
                this.tapPage();
                return;
            }
            this.service.forum(parent).subscribe(data => {
                this.parent.set(data);
                this.tapPage();
            });
        });
    }


    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.forumList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                    this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IForum) {
        this.toastrService.confirm('确定删除“' + item.name + '”板块？', () => {
            this.service.forumRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

    public tapViewChild(item?: IForum) {
        this.parent.set(item);
        this.queries().value.update(v => {
            v.keywords = '';
            v.parent = item ? item.id : 0;
            return {...v};
        });
        this.tapRefresh();
    }

    public tapParent() {
        const parentId = this.parent()?.parent_id || 0;
        if (parentId < 1) {
            this.tapViewChild();
            return;
        }
        this.service.forum(parentId).subscribe(res => {
            this.tapViewChild(res);
        });
    }

}
