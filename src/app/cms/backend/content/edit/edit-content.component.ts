import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { getQueries } from '../../../../theme/query';
import { FileUploadService } from '../../../../theme/services';
import { eachObject } from '../../../../theme/utils';
import { ICmsContent, ICmsFormGroup } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent implements OnInit {

    public data: ICmsContent;
    public queries = {
        model: 0,
        parent: 0,
        site: 0,
        category: 0,
        id: 0,
    };
    public formItems: ICmsFormGroup[] = [];

    public tinyConfigs = {
        height: 500,
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
          this.uploadService.uploadImages(form).subscribe(res => {
            success(res[0].url);
          }, err => {
            failure(err.error.message);
          });
        },
    };

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.service.content(this.queries).subscribe(res => {
                this.data = res;
                this.formItems = res.form_data;
            });
        });
    }

    public tapTab(item: ICmsFormGroup) {
        this.formItems.forEach(i => {
            i.active = i === item;
        })
    }


    public tapSubmit() {
        const data: any = {};
        eachObject(this.queries, (v, k) => {
            if (k === 'id') {
                return;
            }
            data[(k === 'category' ? 'cat' : k) + '_id'] = v;
        });
        this.formItems.forEach(group => {
            group.items.forEach(item => {
                data[item.name] = item.value;
            });
        });
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.contentSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            history.back();
        });
    }

}
