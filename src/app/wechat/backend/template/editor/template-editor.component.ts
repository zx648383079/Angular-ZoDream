import { Component, ViewChild } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { environment } from '../../../../../environments/environment';
import { IItem } from '../../../../theme/models/seo';
import { FileUploadService } from '../../../../theme/services';
import { WechatService } from '../../wechat.service';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent {

    @ViewChild(EditorComponent)
    public editor: EditorComponent;
    public value = '';
    public typeIndex = 0;
    public typeItems: IItem[] = [];
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

    constructor(
        private service: WechatService,
        private uploadService: FileUploadService,
    ) {
        this.service.batch({template_type: {}}).subscribe(res => {
            this.typeItems = res.template_type;
        });
    }

    public tapType(i: number) {
        this.typeIndex = i;
    }
}
