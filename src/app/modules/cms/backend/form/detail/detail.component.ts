import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { eachObject } from '../../../../../theme/utils';
import { ICmsContent, ICmsFormGroup } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class FormDetailComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private searchService = inject(SearchService);


    public data: ICmsContent;
    public queries = {
        model: 0,
        parent: 0,
        site: 0,
        category: 0,
        id: 0,
    };
    public formItems: ICmsFormGroup[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
            this.toastrService.success($localize `Save Successfully`);
            history.back();
        });
    }

}
