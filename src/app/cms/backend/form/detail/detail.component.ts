import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getQueries } from '../../../../theme/query';
import { eachObject } from '../../../../theme/utils';
import { ICmsContent, ICmsFormGroup } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class FormDetailComponent implements OnInit {

    public data: ICmsContent;
    public queries = {
        model: 0,
        parent: 0,
        site: 0,
        category: 0,
        id: 0,
    };
    public formItems: ICmsFormGroup[] = [];

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
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
