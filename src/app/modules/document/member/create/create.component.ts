import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IProject, IProjectEnvironment } from '../../model';
import { DocumentService } from '../document.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent {
    private readonly service = inject(DocumentService);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
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
        this.dataForm.type().value.set(item.value);
    }

    public tapRemoveItem(i: number) {
        this.dataForm.environment().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapAddItem() {
        this.dataForm.environment().value.update(v => {
            v.push({
                name: '',
                title: '',
                domain: ''
            });
            return v;
        });
    }
}
