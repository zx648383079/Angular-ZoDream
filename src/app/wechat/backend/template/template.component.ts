import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { applyHistory, getQueries } from '../../../theme/query';
import { mapFormat } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { IWeChatTemplate, IWeChatTemplateCategory } from '../../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

    public items: IWeChatTemplate[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        type: 0,
        category: 0,
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: any = {};
    public previewData = {
        toggle: false,
        content: null,
    };
    public typeItems: IItem[] = [];
    public categoryItems: IWeChatTemplateCategory[] = [];

    constructor(
        private service: WechatService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
        this.service.batch({
            template_type: {},
            template_category: {}
        }).subscribe(res => {
            this.typeItems = res.template_type;
            this.categoryItems = res.template_category;
        });
    }

    public formatType(val: number) {
        return mapFormat(val, this.typeItems);
    }

    public open(modal: DialogEvent, item?: IWeChatTemplate) {
        this.editData = item ? {...item} : {};
        modal.open(() => {
            this.service.templateSave(this.editData).subscribe({
                next: _ => {
                    this.toastrService.success('添加成功');
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => !emptyValidate(this.editData.content));
    }

    public tapPreview() {
        if (this.previewData.toggle) {
            this.previewData.toggle = false;
            return;
        }
        this.previewData.content = this.sanitizer.bypassSecurityTrustHtml(this.editData.content);
        this.previewData.toggle = true;
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
        this.service.templateList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IWeChatTemplate) {
        this.toastrService.confirm('确定删除“' + item.name + '”模板？', () => {
            this.service.templateRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
