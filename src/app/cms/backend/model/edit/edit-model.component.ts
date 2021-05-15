import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { ICmsModel } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss']
})
export class EditModelComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        table: ['', Validators.required],
        type: 1,
        position: 99,
        child_model: 0,
        category_template: '',
        list_template: '',
        show_template: '',
        setting: this.fb.group({
            is_show: 1,
            is_only: 0
        }),
    });

    public data: ICmsModel;
    public modelItems: ICmsModel[] = [];
    public typeItems = ['实体', '表单'];

    constructor(
        private fb: FormBuilder,
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.service.modelAll(1).subscribe(res => {
            this.modelItems = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.model(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    table: res.table,
                    type: res.type,
                    position: res.position,
                    child_model: res.child_model,
                    category_template: res.category_template,
                    list_template: res.list_template,
                    show_template: res.show_template,
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

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: ICmsModel = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.modelSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
