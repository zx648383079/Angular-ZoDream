import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ICmsModelField[]>([]);
    public readonly isLoading = signal(false);
    public model = 0;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.model = parseInt(params.model, 10);
            this.tapRefresh();
        });
    }


    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.fieldList({
            model: this.model
        }).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
        });
    }

    public tapRemove(item: ICmsModelField) {
        this.toastrService.confirm('确定删除“' + item.name + '”字段？', () => {
            this.service.fieldRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });            
        });

    }

}
