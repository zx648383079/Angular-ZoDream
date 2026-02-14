import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { ButtonEvent } from '../../../../../../components/form';
import { parseNumber } from '../../../../../../theme/utils';
import { IAttribute, IAttributeGroup } from '../../../../model';
import { AttributeService } from '../../attribute.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-attribute',
    templateUrl: './edit-attribute.component.html',
    styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent {
    private readonly service = inject(AttributeService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        property_group: '',
        group_id: '0',
        search_type: '0',
        input_type: '0',
        default_value: '',
        position: 99,
        type: '0',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IAttribute;
    public groupItems: IAttributeGroup[] = [];
    public propertyGroups: string[] = [];

    constructor() {
        this.service.groupAll().subscribe(res => {
            this.groupItems = res.data;
            this.onGroupChange();
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.dataForm.group_id().value.set(params.group);
                return;
            }
            this.service.attr(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    property_group: res.property_group,
                    search_type: res.search_type.toString(),
                    group_id: res.group_id.toString(),
                    input_type: res.input_type.toString(),
                    default_value: res.default_value as string,
                    position: res.position,
                    type: res.type.toString(),
                });
            });
        });
    }

    public readonly isInput = computed(() => {
        return parseNumber(this.dataForm.input_type().value()) > 0;
    });

    public onGroupChange() {
        const group = parseNumber(this.dataForm.group_id().value());
        this.propertyGroups = [];
        for (const item of this.groupItems) {
            if (item.id == group) {
                this.propertyGroups = item.property_groups as any ?? [];
                break;
            }
        }
    }

    public tapBack() {
        this.location.back();
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
        const data: IAttribute = this.dataForm().value() as any;
        e?.enter();
        this.service.attrSave(data).subscribe({
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

}
