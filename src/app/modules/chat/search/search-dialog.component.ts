import { form } from '@angular/forms/signals';
import { Component, inject, viewChild, signal } from '@angular/core';
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
    private readonly service = inject(ChatService);


    private readonly profileModal = viewChild(ProfileDialogComponent);

    public isInput = false;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 10
    }));
    public readonly hasMore = signal(false);
    public readonly items = signal<IUser[]>([]);
    public tabIndex = 0;
    public readonly visible = signal(false);

    private confirmFn: Function;


    public open(cb: () => void) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public close() {
        this.visible.set(false);
        this.confirmFn();
    }

    public tapItem(item: IUser) {
        this.visible.set(false);
        const modal = this.profileModal();
        modal.mode = item.checked ? 0 : 1;
        modal.open(item, res => {
            this.visible.set(true);
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
        this.queries.keywords().value.set('');
        this.isInput = false;
    }

    public onSearchKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.goPage(1);
    }

    public tapPrevious() {
        const page = this.queries.page().value();
        if (page < 2) {
            return;
        }
        this.goPage(page - 1);
    }

    public tapNext() {
        if (!this.hasMore()) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    private goPage(page: number) {
        const queries = {...this.queries().value(), page};
        this.service.search(queries).subscribe(res => {
            this.items.set(res.data);
            this.queries().value.set(queries);
            this.hasMore.set(res.paging.more);
        });
    }
}
