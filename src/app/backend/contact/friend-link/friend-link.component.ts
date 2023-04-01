import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService, ManageDialogEvent } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IFriendLink } from '../../../theme/models/seo';
import { ContactService } from '../contact.service';
import { SearchService } from '../../../theme/services';
import { emailValidate, emptyValidate } from '../../../theme/validators';

@Component({
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {

    public items: IFriendLink[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };
    public editData = {
        name: '',
        url: '',
        logo: '',
        brief: '',
        email: '',
    };
    public isMultiple = false;
    public isChecked = false;

    constructor(
        private service: ContactService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        })
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public tapAdd(modal: DialogEvent) {
        for (const key in this.editData) {
            if (Object.prototype.hasOwnProperty.call(this.editData, key)) {
                this.editData[key] = '';
            }
        }
        modal.open(() => {
            this.service.friendLinkSave(this.editData).subscribe({
                next: res => {
                    this.toastrService.success('添加成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => !emailValidate(this.editData.name) && !emptyValidate(this.editData.url));
    }

    public toggleCheck(item?: IFriendLink) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems;
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
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.friendLinkList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isChecked = false;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
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
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }
}
