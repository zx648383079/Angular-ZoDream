import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ICmsModel } from '../../../model';
import { CmsService } from '../../cms.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-edit-model',
    templateUrl: './edit-model.component.html',
    styleUrls: ['./edit-model.component.scss']
})
export class EditModelComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        table: '',
        type: 1,
        position: 99,
        child_model: '',
        category_template: '',
        list_template: '',
        show_template: '',
        setting: {
            is_show: 1,
            is_only: 0,
            is_extend_auth: 0,
            open_captcha: 0,
            form_template: '',
            show_template: '',
            notify_mail: '',
        }
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.table);
    });

    public data: ICmsModel;
    public modelItems: ICmsModel[] = [];
    public typeItems = ['实体', '表单'];

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
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    table: res.table,
                    type: res.type,
                    position: res.position,
                    child_model: res.child_model as any,
                    category_template: res.category_template,
                    list_template: res.list_template,
                    show_template: res.show_template,
                    setting: res.setting
                });
            });
        });
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
        const data: ICmsModel = this.dataForm().value() as any;
        e?.enter();
        this.service.modelSave(data).subscribe({
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
