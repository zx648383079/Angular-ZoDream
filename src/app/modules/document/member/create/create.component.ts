import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IProject } from '../../model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        cover: [''],
        description: [''],
        status: [0],
    });

    public data: IProject = {
        type: 0,
        environment: [],
    } as any;

    public typeItems = [
        {
            name: '普通文档',
            icon: 'icon-book',
            desc: '支持代码高亮',
            value: 0,
        },
        {
            name: 'API文档',
            icon: 'icon-cloud',
            desc: '专用于API文档快速生成',
            value: 1,
        },
    ];

    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.form.valid) {
            return;
        }
        const data = Object.assign({}, this.form.value) as any;
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

    public tapBack() {
        history.back();
    }

    public tapType(item: any) {
        this.data.type = item.value;
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
