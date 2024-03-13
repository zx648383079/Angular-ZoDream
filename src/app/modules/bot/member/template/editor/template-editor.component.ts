import { Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IPageQueries } from '../../../../../theme/models/page';
import { IItem } from '../../../../../theme/models/seo';
import { IBotTemplate } from '../../../model';
import { BotService } from '../../bot.service';
import { EditorBlockType, EditorComponent } from '../../../../../components/editor';

@Component({
    selector: 'app-bot-m-template-editor',
    templateUrl: './template-editor.component.html',
    styleUrls: ['./template-editor.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TemplateEditorComponent),
        multi: true
    }]
})
export class TemplateEditorComponent implements ControlValueAccessor {

    @ViewChild(EditorComponent)
    public editor: EditorComponent;
    public value = '';
    public disabled = false;
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
    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(
        private service: BotService,
        private sanitizer: DomSanitizer,
    ) {
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
        this.editor.insert({
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

    public onValueChange() {
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
