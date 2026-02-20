import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { IScoreSubtotal } from '../../../../theme/models/seo';
import { IComment } from '../../model';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
    selector: 'app-comment-page',
    templateUrl: './comment-page.component.html',
    styleUrls: ['./comment-page.component.scss']
})
export class CommentPageComponent {
    private readonly service = inject(ShopService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public readonly items = signal<IComment[]>([]);
    public subtotal: IScoreSubtotal;
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    private booted = 0;

    constructor() {
        effect(() => {
            if (this.init() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.service.commentSubtotal(this.itemId()).subscribe(res => {
            this.subtotal = res;
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
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
        this.service.commentList({...queries, item_id: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
