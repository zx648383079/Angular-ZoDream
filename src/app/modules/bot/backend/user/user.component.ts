import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IBotUser } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
    selector: 'app-bot-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBotUser[]>([]);

    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
        group: 0,
    }));
    public readonly editForm = form(signal({
        id: 0,
        note_name: '',
        is_black: false,
        remark: '',
        group_id: 0,
    }));

    get selectUrl() {
        return 'wx/admin/user/group_search?wid=' + this.service.baseId;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapEdit(modal: DialogEvent, item: IBotUser) {
        this.editForm().value.set({
            id: item.id,
            note_name: item.note_name,
            is_black: item.is_black > 0,
            remark: item.remark,
            group_id: item.group_id,
        });
        modal.open(() => {
            this.service.userUpdate(item.id, {
                note_name: this.editForm.note_name,
                is_black: this.editForm.is_black
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
        this.service.userList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”会员？', () => {
            this.service.userRemove(item.id).subscribe(res => {
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
