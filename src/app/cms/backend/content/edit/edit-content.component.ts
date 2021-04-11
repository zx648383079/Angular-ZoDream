import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../../theme/services';
import { ICmsContent, ICmsFormGroup } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent implements OnInit {

    public data: ICmsContent;
    private site = 0;
    private category = 0;
    public formItems: ICmsFormGroup[] = [];

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.site = parseInt(params.site, 10);
            this.category = parseInt(params.category, 10);
            this.service.content(this.site, this.category, params.id).subscribe(res => {
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
        this.formItems.forEach(group => {
            group.items.forEach(item => {
                data[item.name] = item.value;
            });
        });
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.site = this.site;
        data.category = this.category;
        this.service.contentSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            history.back();
        });
    }

}
