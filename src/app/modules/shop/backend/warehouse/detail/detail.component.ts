import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IWarehouse } from '../../../model';
import { WarehouseService } from '../warehouse.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(WarehouseService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        tel: '',
        link_user: '',
        address: '',
        remark: '',
        region: [],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.tel);
        required(schemaPath.link_user);
        required(schemaPath.address);
    });

    public data: IWarehouse;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.warehouse(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                        id: res.id,
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
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IWarehouse = this.dataForm().value() as any;
        this.service.warehouseSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
