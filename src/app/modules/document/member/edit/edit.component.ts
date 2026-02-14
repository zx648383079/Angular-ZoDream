import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IProject, IProjectEnvironment } from '../../model';
import { DocumentService } from '../document.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        type: 0,
        name: '',
        cover: '',
        description: '',
        status: '0',
        environment: <IProjectEnvironment[]>[],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IProject;

    public readonly tabIndex = signal(0);

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id || params.id < 1) {
                this.location.back();
                return;
            }
            this.service.project(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    type: res.type,
                    name: res.name,
                    cover: res.cover,
                    description: res.description,
                    status: res.status as any,
                    environment: res.environment ?? []
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
            return;
        }
        const data = this.dataForm().value();
        if (data.type > 0) {
            data.environment = data.environment.filter(i => {
                return i.name.trim().length > 0;
            });
            if (!data.environment || data.environment.length < 1) {
                this.toastrService.warning('环境域名必须有一个');
                return;
            }
        }
        e?.enter();
        this.service.projectSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.location.back();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapRemoveItem(i: number) {
        this.dataForm.environment().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public tapAddItem() {
        this.dataForm.environment().value.update(v => {
            v.push({
                name: '',
                title: '',
                domain: ''
            });
            return [...v];
        });
    }

}
