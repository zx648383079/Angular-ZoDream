import { form, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService, ManageDialogEvent } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IFriendLink } from '../../../theme/models/seo';
import { ContactService } from '../contact.service';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-contact-friend-link',
    templateUrl: './friend-link.component.html',
    styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {
    private readonly service = inject(ContactService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IFriendLink[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public readonly editForm = form(signal({
        name: '',
        url: '',
        logo: '',
        brief: '',
        email: '',
    }), schemaPath => {
        required(schemaPath.name);
        required(schemaPath.url);
    });
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        })
    }

    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public toggleMultiple() {
        this.isMultiple.update(v => !v);
    }

    public tapAdd(modal: DialogEvent) {
        for (const key in this.editForm) {
            if (Object.prototype.hasOwnProperty.call(this.editForm, key)) {
                this.editForm[key] = '';
            }
        }
        modal.open(() => {
            this.service.friendLinkSave(this.editForm().value()).subscribe({
                next: res => {
                    this.toastrService.success('添加成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.editForm().valid());
    }

    public toggleCheck(item?: IFriendLink) {
        if (!item) {
            this.isChecked.update(v => !v);
            const isChecked = this.isChecked();
            this.items.update(v => {
                return v.map(i => {
                    i.checked = isChecked;
                    return i;
                });
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked.set(false);
            return;
        }
        if (this.checkedItems().length === this.items().length) {
            this.isChecked.set(true);
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems();
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}条友情链接？`, () => {
            this.service.friendLinkRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
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
        this.service.friendLinkList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.isChecked.set(false);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapPass(item: IFriendLink, modal: ManageDialogEvent) {
        this.toggleItem(item, modal, '确认审核通过此友情链接？', '已审核通过！');
    }

    public tapOff(item: IFriendLink, modal: ManageDialogEvent) {
        this.toggleItem(item, modal, '确认下架此友情链接？', '已下架！');
    }

    private toggleItem(item: IFriendLink, modal: ManageDialogEvent, title: string, success: string) {
        modal.open(data => {
            this.service.friendLinkToggle({
                ...data,
                id: item.id,
            }).subscribe(res => {
                if (!res) {
                    return;
                }
                this.toastrService.success(success);
                item.status = res.status;
            });
        }, title);
    }

    public tapRemove(item: IFriendLink) {
        this.toastrService.confirm('确认删除此友情链接？', () => {
            this.service.friendLinkRemove(item.id).subscribe(res => {
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
}
