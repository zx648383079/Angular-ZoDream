import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IItem } from '../../../../../theme/models/seo';
import { parseNumber } from '../../../../../theme/utils';
import { IRegion, IShipping, IShippingGroup } from '../../../model';
import { PaymentService } from '../../payment.service';
import { RegionService } from '../../region.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditShippingComponent implements OnInit {
    private readonly service = inject(PaymentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private regionService = inject(RegionService);


    public data: IShipping;

    public readonly items = signal<IItem[]>([]);

    public regionItems: IRegion[] = [];
    public selectedItems: IRegion[] = [];
    public selectedAll = false;
    public readonly regionQueries = form(signal({
        keywords: '',
    }));

    public readonly dataModel = signal({
        id: 0,
        name: '',
        code: '',
        method: '0',
        icon: '',
        description: '',
        cod_enabled: 0,
        position: 99,
        groups: <IShippingGroup[]>[]
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.code);
    });
    public readonly method = computed(() => parseNumber(this.dataForm.method().value()));

    constructor() {
        this.service.shippingPlugin().subscribe(res => {
            this.items.set(res);
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.shipping(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    method: res.method.toString(),
                    icon: res.icon,
                    description: res.description,
                    position: res.position,
                    cod_enabled: res.cod_enabled,
                    groups: res.groups.map(item => {
                        if (!item.region_label) {
                            item.region_label = this.formatRegion(item);
                        }
                        return item;
                    })
                });
            });
        });
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

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
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

    public open(modal: DialogEvent, item?: IShippingGroup) {
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
                this.dataForm.groups().value.update(v => {
                    v.push(item);
                    return [...v];
                });
            }
        });
    }

    public removeGroup(item: any) {
        this.dataForm.groups().value.update(v => v.filter(i => i !== item));
    }

    public tapSelectAll() {
        this.selectedAll = !this.selectedAll;
    }

    public tapRegionSearch() {
        this.regionService.regionSearch(this.regionQueries().value()).subscribe(res => {
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
