import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../dialog';
import { IItem } from '../../../../../theme/models/seo';
import { ICmsFormGroup, ICmsFormInput, ICmsModelField } from '../../../../model';
import { CmsService } from '../../../cms.service';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        field: ['', Validators.required],
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
        setting: this.fb.group({}),
    });

    public data: ICmsModelField;
    public typeItems: IItem[] = [];
    public tabItems: string[] = [];
    public optionItems: ICmsFormInput[] = [];
    private model = 0;

    constructor(
        private fb: FormBuilder,
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.model = parseInt(params.model, 10);
            this.service.batch({
                field_type: {},
                model_tab: {model: this.model}
            }).subscribe(res => {
                this.tabItems = res.model_tab;
                this.typeItems = res.field_type;
                this.form.patchValue({
                    tab_name: this.tabItems[1]
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
                this.form.patchValue({
                    name: res.name,
                    field: res.field,
                    type: res.type,
                    position: res.position,
                    is_main: res.is_main,
                    is_required: res.is_required,
                    is_search: res.is_search,
                    length: res.length,
                    match: res.match,
                    tip_message: res.tip_message,
                    error_message: res.error_message,
                    tab_name: res.tab_name,
                });
                if (res.setting) {
                    this.form.patchValue({
                        setting: this.fb.group(res.setting)
                    });
                }
            });
        });
    }

    get typeValue() {
        return this.form.get('type').value;
    }

    public tapBack() {
        history.back();
    }

    public onTypeChange() {
        this.service.fieldOption(this.typeValue, this.data ? this.data.id : 0).subscribe(res => {
            this.optionItems = res.data ? res.data : [];
        });
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: ICmsModelField = Object.assign({
            model_id: this.model,
        }, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        const option: any = {};
        this.optionItems.forEach(i => {
            option[i.name] = i.value;
        });
        if (!data.setting) {
            data.setting = {};
        }
        data.setting.option = option;
        this.service.fieldSave(data).subscribe({
            next: _ => {
                this.toastrService.success('保存成功');
                this.tapBack();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }


}
