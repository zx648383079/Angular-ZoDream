import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { FileUploadService } from '../../../theme/services';
import { IHtmlEditorOption } from '../model';

@Component({
    selector: 'app-html-editor',
    templateUrl: './html-editor.component.html',
    styleUrls: ['./html-editor.component.scss'],
    providers: [
        {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => HtmlEditorComponent),
        multi: true
        }
    ]
})
export class HtmlEditorComponent implements ControlValueAccessor {

    public disabled = false;
    public value = '';
    public editorConfigs: IHtmlEditorOption = {
        key: environment.editorKey,
        init: {
            height: 500,
            base_url: '/tinymce',
            suffix: '.min',
            language_url: '../../../../assets/tinymce/langs/zh_CN.js',
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
            images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                const form = new FormData();
                form.append('file', blobInfo.blob(), blobInfo.filename());
                this.uploadService.uploadImages(form).subscribe({
                    next: res => {
                        resolve(res[0].url);
                    }, 
                    error: err => {
                        reject(err.error.message);
                    }
                });
            }),
        }
    };

    onChange: any = () => { };
    onTouch: any = () => { };

    constructor(
        private uploadService: FileUploadService,
    ) { }

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
