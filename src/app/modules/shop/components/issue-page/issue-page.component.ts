import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class IssuePageComponent implements OnChanges {

    @Input() public itemId = 0;
    @Input() public init = false;
    public items: IIssue[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public editData = {
        content: ''
    };
    private booted = 0;

    constructor(
        private service: ShopService,
        private toastrService: DialogService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.itemId > 0 && this.booted !== this.itemId) {
            this.boot();
        }
    }

    private boot() {
        this.booted = this.itemId;
        if (this.itemId < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapSubmit(e: ButtonEvent) {
        if (emptyValidate(this.editData.content)) {
            this.toastrService.warning($localize `Please input the question`);
            return;
        }
        e.enter();
        this.service.issueAsk({...this.editData, item_id: this.itemId}).subscribe({
            next: () => {
                this.editData.content = '';
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
        this.goPage(this.queries.page + 1);
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
        this.service.issueList({...queries, item_id: this.itemId}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
