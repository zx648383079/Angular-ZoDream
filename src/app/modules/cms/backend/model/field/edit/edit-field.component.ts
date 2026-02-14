import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IItem } from '../../../../../../theme/models/seo';
import { ICmsModelField } from '../../../../model';
import { CmsService } from '../../../cms.service';
import { form, required } from '@angular/forms/signals';
import { ArraySource, ButtonEvent, IFormInput } from '../../../../../../components/form';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-edit-field',
    templateUrl: './edit-field.component.html',
    styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        field: '',
        is_main: 0,
        position: 99,
        type: 'text',
        is_required: 0,
        is_search: 0,
        length: '',
        match: '',
        tip_message: '',
        error_message: '',
        tab_name: '',
        model_id: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.field);
    });

    public readonly data = signal<ICmsModelField>(null);
    public typeItems: IItem[] = [];
    public readonly tabItems = signal(ArraySource.empty);

    public readonly optionItems = signal<IFormInput[]>([]);

    public readonly optionForm = computed(() => {
        const items = this.optionItems();
        const groups: any = {};
        for (const item of items) {
            groups[item.name] = new FormControl(typeof item.value === 'undefined' ? '' : item.value);
        }
        return new FormGroup(groups);
    });

    constructor() {
        this.route.params.subscribe(params => {
            const model = parseInt(params.model, 10);
            this.service.batch({
                field_type: {},
                model_tab: {model: model}
            }).subscribe(res => {
                this.tabItems.set(ArraySource.fromValue(...res.model_tab));
                this.typeItems = res.field_type;
                this.dataModel.update(v => {
                    v.tab_name = this.tabItems[1];
                    v.model_id = model;
                    return {...v};
                });
            });
            if (!params.id) {
                this.onTypeChange();
                return;
            }
            this.service.field(params.id).subscribe(res => {
                this.data.set(res);
                if (!res.tab_name) {
                    res.tab_name = this.tabItems[res.is_main > 0 ? 1 : 0];
                }
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    field: res.field,
                    type: res.type,
                    position: res.position,
                    is_main: res.is_main,
                    is_required: res.is_required,
                    is_search: res.is_search,
                    length: res.length as any,
                    match: res.match,
                    tip_message: res.tip_message,
                    error_message: res.error_message,
                    tab_name: res.tab_name,
                    model_id: model,
                });
                if (res.setting) {
                    // TODO
                }
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public onTypeChange() {
        this.service.fieldOption(this.dataForm.type().value(), this.data() ? this.data().id : 0).subscribe(res => {
            this.optionItems.set(res.data ? res.data.map(i => {
                i.optionSource = ArraySource.fromItems(i.items);
                return i;
            }) : []);
        });
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
        const data = this.dataForm().value();
        const option = this.optionForm().getRawValue();
        e?.enter();
        this.service.fieldSave({...data, options: undefined, setting: {option}}).subscribe({
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
