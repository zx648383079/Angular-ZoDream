import { Component, inject, viewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { IPageQueries } from '../../../theme/models/page';
import { ProfileDialogComponent } from '../profile/profile-dialog.component';
import { IUser } from '../../../theme/models/user';

@Component({
    standalone: false,
    selector: 'app-chat-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {
    private service = inject(ChatService);


    private readonly profileModal = viewChild(ProfileDialogComponent);

    public isInput = false;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 10
    };
    public hasMore = false;
    public items: IUser[] = [];
    public tabIndex = 0;
    public visible = false;

    private confirmFn: Function;


    public open(cb: () => void) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public close() {
        this.visible = false;
        this.confirmFn();
    }

    public tapItem(item: IUser) {
        this.visible = false;
        profileModal.mode = item.checked ? 0 : 1;
        profileModal.open(item, res => {
            this.visible = true;
            if (!res) {
                return;
            }
            if (item.checked) {
                return;
            }
            this.service.apply({
                [this.tabIndex > 0 ? 'group' : 'user']: item.id,
                remark: this.profileModal().remark
            }).subscribe(_ => item.checked = true)
        });
    }

    public tapSearchTab(i: number) {
        this.tabIndex = i;
    }

    public tapSearchInput() {
        this.isInput = true;
    }

    public tapSearchClear() {
        this.queries.keywords = '';
        this.isInput = false;
    }

    public onSearchKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.goPage(1);
    }

    public tapPrevious() {
        if (this.queries.page < 2) {
            return;
        }
        this.goPage(this.queries.page - 1);
    }

    public tapNext() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    private goPage(page: number) {
        const queries = {...this.queries, page};
        this.service.search(queries).subscribe(res => {
            this.items = res.data;
            this.queries = queries;
            this.hasMore = res.paging.more;
        });
    }
}
