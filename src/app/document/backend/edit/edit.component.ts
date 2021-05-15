import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../dialog';
import { IProject } from '../../model';
import { DocumentService } from '../document.service';

@Component({
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

    public tapSubmit() {
        if (!this.form.valid) {
            return;
        }
        const data = Object.assign({
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
        this.service.projectSave(data).subscribe(res => {
            this.toastrService.success('保存成功');
            history.back();
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
