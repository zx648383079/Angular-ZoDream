import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ICmsModelField } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
    standalone: false,
  selector: 'app-model-field',
  templateUrl: './model-field.component.html',
  styleUrls: ['./model-field.component.scss']
})
export class ModelFieldComponent implements OnInit {

    public items: ICmsModelField[] = [];
    public isLoading = false;
    public model = 0;

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.model = parseInt(params.model, 10);
            this.tapRefresh();
        });
    }


    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.fieldList({
            model: this.model
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
        });
    }

    public tapRemove(item: ICmsModelField) {
        if (!confirm('确定删除“' + item.name + '”字段？')) {
            return;
        }
        this.service.fieldRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
