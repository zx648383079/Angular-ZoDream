import { Component, inject, input, model, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPageQueries } from '../../../../../theme/models/page';
import { IItem } from '../../../../../theme/models/seo';
import { IBotTemplate } from '../../../model';
import { BotService } from '../../bot.service';
import { EditorBlockType, EditorComponent } from '../../../../../components/editor';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bot-m-template-editor',
    templateUrl: './template-editor.component.html',
    styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements FormValueControl<string> {
    private service = inject(BotService);
    private sanitizer = inject(DomSanitizer);


    public readonly editor = viewChild(EditorComponent);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public typeItems: IItem[] = [];
    public templateItems: IBotTemplate[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        type: 0,
        keywords: '',
        page: 1,
        per_page: 20
    };

    constructor() {
        this.service.batch({template_type: {}}).subscribe(res => {
            this.typeItems = res.template_type;
            if (this.typeItems.length > 0) {
                this.tapType(this.typeItems[0].value);
            }
        });
    }

    public tapType(i: any) {
        this.queries.type = i;
        this.tapRefresh();
    }

    public tapInsert(item: IBotTemplate) {
        this.editor().insert({
            type: EditorBlockType.AddRaw,
            value: item.content + '<p></p>'
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
        this.service.templateList(queries).subscribe({
            next: res => {
                const items = res.data.map(i => {
                    i.html = this.sanitizer.bypassSecurityTrustHtml(i.content);
                    return i;
                });
                this.isLoading = false;
                this.templateItems = page < 2 ? items : [].concat(this.templateItems, items);
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

}
