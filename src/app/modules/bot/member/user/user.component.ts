import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService, ThemeService } from '../../../../theme/services';
import { IBotUser } from '../../model';
import { BotService } from '../bot.service';

@Component({
  selector: 'app-bot-m-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public items: IBotUser[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        group: 0,
    };
    public editData: any = {};

    constructor(
        private service: BotService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Account Center`);
    }

    get selectUrl() {
        return 'wx/admin/user/group_search?wid=' + this.service.baseId;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapEdit(modal: DialogEvent, item: IBotUser) {
        this.editData = {
            id: item.id,
            note_name: item.note_name,
            is_black: item.is_black,
            remark: item.remark,
            group_id: item.group_id,
        };
        modal.open(() => {
            this.service.userUpdate(item.id, {
                note_name: this.editData.note_name,
                is_black: this.editData.is_black
            }).subscribe({
                next: res => {
                    this.toastrService.success('修改成功');
                    item.is_black = res.is_black;
                    item.note_name = res.note_name;
                    item.remark = res.remark;
                    item.group_id = res.group_id;
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        },  `修改会员(${item.nickname})`);
    }

    public onBlackChange(item: IBotUser) {
        this.service.userUpdate(item.id, {
            is_black: item.is_black
        }).subscribe({
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapAsync(e?: ButtonEvent) {
        this.toastrService.confirm('确定要同步公众号用户？', () => {
            e?.enter();
            this.service.userAsync().subscribe({
                next: _ => {
                    e?.reset();
                    this.toastrService.success('同步成功！');
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            })
        });
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
        this.service.userList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”会员？', () => {
            this.service.userRemove(item.id).subscribe(res => {
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
