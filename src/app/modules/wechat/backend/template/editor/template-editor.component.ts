import { Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { environment } from '../../../../../../environments/environment';
import { IPageQueries } from '../../../../../theme/models/page';
import { IItem } from '../../../../../theme/models/seo';
import { FileUploadService } from '../../../../../theme/services';
import { IWeChatTemplate } from '../../../model';
import { WechatService } from '../../wechat.service';

@Component({
    selector: 'app-template-editor',
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
    public templateItems: IWeChatTemplate[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        type: 0,
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editorConfigs = {
        key: environment.editorKey,
        init: {
            height: 800,
            base_url: '/tinymce',
            suffix: '.min',
            language_url: '../../../assets/tinymce/langs/zh_CN.js',
            language: 'zh_CN',
            plugins: [
            'advlist autolink lists link image imagetools charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
            image_caption: true,
            paste_data_images: true,
            imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
            images_upload_handler: (blobInfo, success: (url: string) => void, failure: (error: string) => void) => {
            const form = new FormData();
            form.append('file', blobInfo.blob(), blobInfo.filename());
            this.uploadService.uploadImages(form).subscribe({
                next: res => {
                    success(res[0].url);
                }, 
                error: err => {
                    failure(err.error.message);
                }
            });
            },
        }
    };
    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(
        private service: WechatService,
        private uploadService: FileUploadService,
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

    public tapInsert(item: IWeChatTemplate) {
        this.editor.editor.insertContent(item.content + '<p></p>');
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
