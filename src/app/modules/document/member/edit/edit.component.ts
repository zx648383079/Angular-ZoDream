import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IProject } from '../../model';
import { DocumentService } from '../document.service';

@Component({
    standalone: false,
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        cover: [''],
        description: [''],
        status: [0],
    });

    public data: IProject;

    public tabIndex = 0;

    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id || params.id < 1) {
                history.back();
                return;
            }
            this.service.project(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    cover: res.cover,
                    description: res.description,
                    status: res.status,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.form.valid) {
            return;
        }
        const data: any = Object.assign({
            id: this.data.id,
        }, this.form.value);
        data.type = this.data.type;
        if (data.type > 0) {
            data.environment = this.data.environment.filter(i => {
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
                history.back();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapRemoveItem(i: number) {
        this.data.environment.splice(i, 1);
    }

    public tapAddItem() {
        this.data.environment.push({
            name: '',
            title: '',
            domain: ''
        });
    }

}
