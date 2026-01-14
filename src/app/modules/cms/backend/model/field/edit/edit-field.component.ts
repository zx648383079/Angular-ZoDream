import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IItem } from '../../../../../../theme/models/seo';
import { ICmsFormInput, ICmsModelField } from '../../../../model';
import { CmsService } from '../../../cms.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-edit-field',
    templateUrl: './edit-field.component.html',
    styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


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
        options: <ICmsFormInput[]>[]
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.field);
    });

    public data: ICmsModelField;
    public typeItems: IItem[] = [];
    public tabItems: string[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            const model = parseInt(params.model, 10);
            this.service.batch({
                field_type: {},
                model_tab: {model: model}
            }).subscribe(res => {
                this.tabItems = res.model_tab;
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
                this.data = res;
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
                    options: []
                });
                if (res.setting) {
                    // TODO
                }
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public onTypeChange() {
        this.service.fieldOption(this.dataForm.type().value(), this.data ? this.data.id : 0).subscribe(res => {
            this.dataForm.options().value.set(res.data ? res.data : []);
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
        const option: any = {};
        data.options.forEach(i => {
            option[i.name] = i.value;
        });
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
