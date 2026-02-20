import { form } from '@angular/forms/signals';
import { Component, inject, input, model, viewChild, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPageQueries } from '../../../../../theme/models/page';
import { IItem } from '../../../../../theme/models/seo';
import { EditorBlockType, EditorComponent } from '../../../../../components/editor';
import { IBotTemplate } from '../../../model';
import { BotService } from '../../bot.service';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bot-template-editor',
    templateUrl: './template-editor.component.html',
    styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements FormValueControl<string> {
    private readonly service = inject(BotService);
    private readonly sanitizer = inject(DomSanitizer);


    public readonly editor = viewChild(EditorComponent);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public typeItems: IItem[] = [];
    public templateItems: IBotTemplate[] = [];
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        type: 0,
        keywords: '',
        page: 1,
        per_page: 20
    }));

    constructor() {
        this.service.batch({template_type: {}}).subscribe(res => {
            this.typeItems = res.template_type;
            if (this.typeItems.length > 0) {
                this.tapType(this.typeItems[0].value);
            }
        });
    }

    public tapType(i: any) {
        this.queries.type().value.set(i);
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
        this.service.templateList(queries).subscribe({
            next: res => {
                const items = res.data.map(i => {
                    i.html = this.sanitizer.bypassSecurityTrustHtml(i.content);
                    return i;
                });
                this.isLoading.set(false);
                this.templateItems = page < 2 ? items : [].concat(this.templateItems, items);
                this.hasMore.set(res.paging.more);
                this.total.set(res.paging.total);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
