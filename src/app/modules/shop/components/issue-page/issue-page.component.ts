import { form, required } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ShopService } from '../../shop.service';
import { IIssue } from '../../model';
import { ButtonEvent } from '../../../../components/form';
import { emptyValidate } from '../../../../theme/validators';
import { DialogService } from '../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-issue-page',
    templateUrl: './issue-page.component.html',
    styleUrls: ['./issue-page.component.scss']
})
export class IssuePageComponent {
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public items: IIssue[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public readonly editForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });
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
        this.tapRefresh();
    }

    public tapSubmit(e: ButtonEvent) {
        if (this.editForm().invalid()) {
            this.toastrService.warning($localize `Please input the question`);
            return;
        }
        e.enter();
        this.service.issueAsk({...this.editForm().value(), item_id: this.itemId()}).subscribe({
            next: () => {
                this.editForm.content().value.set('');
                e.reset();
                this.toastrService.success($localize `Ask Successfully`);
            },
            error: err => {
                e.reset();
                this.toastrService.error(err);
            }
        })
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.issueList({...queries, item_id: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
