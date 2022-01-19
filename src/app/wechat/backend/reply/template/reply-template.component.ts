import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../dialog';
import { ButtonEvent } from '../../../../form';
import { IPageQueries } from '../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../theme/query';
import { IWeChatReplyTemplate } from '../../../model';
import { formatTemplateField, renderTemplateField } from '../../../util';
import { WechatService } from '../../wechat.service';



@Component({
  selector: 'app-reply-template',
  templateUrl: './reply-template.component.html',
  styleUrls: ['./reply-template.component.scss']
})
export class ReplyTemplateComponent implements OnInit {

    public items: IWeChatReplyTemplate[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public selected = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };

    public editData: any = {};

    constructor(
        private service: WechatService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item: IWeChatReplyTemplate) {
        this.editData = {
            template: item,
            link_type: 0,
            items: formatTemplateField(item.content),
        };
        modal.open();
        this.onFieldChange();
    }

    public onFieldChange() {
        this.editData.content = renderTemplateField(this.editData.template.content, this.editData.items);
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
        this.service.wxTemplateList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

}
