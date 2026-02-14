import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { LegworkService } from '../../../legwork.service';
import { ICategory, IService } from '../../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-service',
    templateUrl: './edit-service.component.html',
    styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent {
    private readonly service = inject(LegworkService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public data: IService;
    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        cat_id: '',
        price: 0,
        brief: '',
        content: '',
        form: [
            {
                name: '',
                label: '',
                required: false,
                only: false,
            }
        ]
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.thumb);
        required(schemaPath.cat_id);
        required(schemaPath.price);
    });
    public categories: ICategory[] = [];

    constructor() {
        this.service.providerCategory().subscribe(res => {
            this.categories = res.data.filter(i => i.status === 1);
            if (this.categories.length < 1) {
                this.toastrService.warning($localize `You have not approved the classification and cannot publish the service`);
            }
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.addForm();
                return;
            }
            this.loadService(params.id);
        });
    }

    public addForm() {
        this.dataForm.form().value.update(v => {
            v.push({
                name: '',
                label: '',
                required: false,
                only: false,
            });
            return [...v];
        });
    }

    public removeForm(i: number) {
        this.dataForm.form().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    private loadService(id: any) {
        this.service.providerService(id).subscribe(res => {
            this.data = res;
            this.dataModel.set({
                id: res.id,
                name: res.name,
                thumb: res.thumb,
                cat_id: res.cat_id as any,
                price: res.price,
                brief: res.brief,
                content: res.content,
                form: res.form?.length > 0 ? res.form.map(v => {
                    return {
                        name: v.name,
                        label: v.label,
                        required: v.required,
                        only: v.only, 
                    };
                }) : [{
                    name: '',
                    label: '',
                    required: false,
                    only: false,
                }] as any
            });
        });
    }

    public tapSubmit(e: Event) {
        e.preventDefault();
        if (this.dataForm().invalid()) {
            return;
        }
        const data: IService = this.dataForm().value() as any;
        if (this.data) {
            data.id = this.data.id;
        }
        data.form = data.form.filter(i => !!i.name).map(i => {
            if (!i.label) {
                i.label = i.name;
            }
            return i;
        });
        this.service.providerServiceSave(data).subscribe({
            next: res => {
                this.toastrService.success($localize `Save successfully`);
                this.location.back();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
