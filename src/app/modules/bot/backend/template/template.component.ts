import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { IBotTemplate, IBotTemplateCategory } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
  selector: 'app-bot-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private sanitizer = inject(DomSanitizer);
    private readonly searchService = inject(SearchService);


    public items: IBotTemplate[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        type: 0,
        category: 0,
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public editData: any = {};
    public previewData = {
        toggle: false,
        content: null,
    };
    public typeItems: IItem[] = [];
    public categoryItems: IBotTemplateCategory[] = [];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.searchService.getQueries(params, this.queries);
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

    public open(modal: DialogEvent, item?: IBotTemplate) {
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
        this.previewData.content = this.sanitizer.bypassSecurityTrustHtml(this.editData.content || '');
        this.previewData.toggle = true;
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.templateList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IBotTemplate) {
        this.toastrService.confirm('确定删除“' + item.name + '”模板？', () => {
            this.service.templateRemove(item.id).subscribe(res => {
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
