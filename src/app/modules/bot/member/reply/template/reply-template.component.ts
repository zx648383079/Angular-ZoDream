import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IPage, IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';
import { IBotReplyTemplate, IBotUser } from '../../../model';
import { formatTemplateField, renderTemplateField } from '../../../util';
import { BotService } from '../../bot.service';



@Component({
    standalone: false,
  selector: 'app-reply-template',
  templateUrl: './reply-template.component.html',
  styleUrls: ['./reply-template.component.scss']
})
export class ReplyTemplateComponent implements OnInit {

    public items: IBotReplyTemplate[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public selected = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public editData: any = {};
    public sendData: any = {};

    constructor(
        private service: BotService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {}

    public formatUser = (res: IPage<IBotUser>) => {
        return res.data.map(i => {
            return {
                id: i.id,
                name: i.note_name || i.nickname
            };
        });
    };

    public get selectUrl() {
        switch (this.sendData.to_type) {
            case 2:
                return 'wx/admin/user/search?wid=' + this.service.baseId;
            case 1:
                return 'wx/admin/user/group_search?wid=' + this.service.baseId;
            default:
                return null;
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapEdit(modal: DialogEvent, item?: IBotReplyTemplate) {
        this.editData = item ? {...item} : {};
        modal.open(() => {
            this.service.wxTemplateSave(this.editData).subscribe({
                next: _ => {
                    if (item) {
                        this.tapPage();
                    } else {
                        this.tapRefresh();
                    }
                    this.toastrService.success($localize `Save Successfully`);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => !emptyValidate(this.editData.template_id) && !emptyValidate(this.editData.content));
    }

    public tapRemove(item: IBotReplyTemplate) {
        this.toastrService.confirm('确定删除“' + item.title + '”模板？', () => {
            this.service.wxTemplateRemove(item.id).subscribe(res => {
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

    public open(modal: DialogEvent, item: IBotReplyTemplate) {
        this.sendData = {
            template: item,
            items: formatTemplateField(item.content),
            to_type: 2,
            to: 0
        };
        modal.open(() => {
            this.service.send({
                to_type: 2,
                to: this.sendData.to,
                type: 3,
                content: {
                    template_id: item.template_id,
                    template_url: this.sendData.template_url,
                    appid: this.sendData.appid,
                    path: this.sendData.path,
                    template_data: this.sendData.items,
                }
            }).subscribe({
                next: _ => {
                    this.toastrService.success('发送成功');
                },
                error: err => {
                    this.toastrService.error(err); 
                }
            })
        });
        this.onFieldChange();
    }

    public onFieldChange() {
        this.sendData.content = renderTemplateField(this.sendData.template.content, this.sendData.items);
    }

    public tapAsync(e?: ButtonEvent) {
        this.toastrService.confirm('确定要同步公众号模板？', () => {
            e?.enter();
            this.service.wxTemplateAsync().subscribe({
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
        this.service.wxTemplateList(queries).subscribe({
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

}
