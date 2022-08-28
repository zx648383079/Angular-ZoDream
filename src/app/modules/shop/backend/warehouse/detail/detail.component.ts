import {
    Component,
    OnInit
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IWarehouse } from '../../../model';
import { WarehouseService } from '../warehouse.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        tel: ['', Validators.required],
        link_user: ['', Validators.required],
        address: ['', Validators.required],
        remark: [''],
        region: [[]],
    });

    public data: IWarehouse;

    constructor(
        private service: WarehouseService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.warehouse(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    tel: res.tel,
                    link_user: res.link_user,
                    address: res.address,
                    remark: res.remark,
                    region: res.region || [] as any,
                });
            });
        });
    }


    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IWarehouse = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.warehouseSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
