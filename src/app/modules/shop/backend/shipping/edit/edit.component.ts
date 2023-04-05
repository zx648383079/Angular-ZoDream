import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { parseNumber } from '../../../../../theme/utils';
import { IRegion, IShipping, IShippingGroup } from '../../../model';
import { PaymentService } from '../../payment.service';
import { RegionService } from '../../region.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditShippingComponent implements OnInit {

    public data: IShipping;

    public items: IItem[] = [];

    public regionItems: IRegion[] = [];
    public selectedItems: IRegion[] = [];
    public selectedAll = false;
    public groupItems: IShippingGroup[] = [];
    public regionKeywords = '';

    public form = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        method: ['0'],
        icon: [''],
        description: [''],
        position: [99],
    });

    constructor(
        private service: PaymentService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastrService: DialogService,
        private regionService: RegionService,
    ) {
        this.service.shippingPlugin().subscribe(res => {
            this.items = res;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.shipping(params.id).subscribe(res => {
                this.data = res;
                this.groupItems = res.groups.map(item => {
                    if (!item.region_label) {
                        item.region_label = this.formatRegion(item);
                    }
                    return item;
                });
                this.form.patchValue({
                    name: res.name,
                    code: res.code,
                    method: res.method.toString(),
                    icon: res.icon,
                    description: res.description,
                    position: res.position,
                });
            });
        });
    }

    get method() {
        return parseNumber(this.form.get('method').value);
    }

    private formatRegion(item: IShippingGroup): string {
        if (item.is_all) {
            return '全部地区';
        }
        return item.regions.map(i => i.name).join('、');
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.groups = this.groupItems;
        e?.enter();
        this.service.shippingSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }
    
    public open(modal: DialogBoxComponent, item?: IShippingGroup) {
        const isNew = !item;
        if (!item) {
            item = {
                regions: [],
                is_all: false,
                first_step: 0,
                first_fee: 0,
                additional: 0,
                additional_fee: 0,
                free_step: 0,
            };
        }
        this.selectedItems = item.regions;
        this.selectedAll = item.is_all;
        modal.open(() => {
            item.regions = this.selectedAll ? [] : this.selectedItems;
            item.is_all = this.selectedAll;
            item.region_label = this.formatRegion(item);
            if (isNew) {
                this.groupItems.push(item);
            }
        });
    }

    public removeGroup(item: any) {
        this.groupItems = this.groupItems.filter(i => i !== item);
    }

    public tapSelectAll() {
        this.selectedAll = !this.selectedAll;
    }

    public tapRegionSearch() {
        this.regionService.regionSearch({
            keywords: this.regionKeywords,
        }).subscribe(res => {
            this.regionItems = res.data;
        });
    }

    public tapAddRegion(item: IRegion) {
        if (this.selectedAll) {
            return;
        }
        for (const region of this.selectedItems) {
            if (region.id === item.id || item.full_name.indexOf(region.full_name) === 0) {
                return;
            }
        }
        this.selectedItems.push(item);
    }

    public removeRegion(item: IRegion) {
        this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    }
}
