import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { ICategory, IProject } from '../../model';
import { DocumentService } from '../document.service';

@Component({
    standalone: false,
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
    private readonly service = inject(DocumentService);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        name: '',
        cover: '',
        cat_id: 0,
        description: '',
        status: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IProject = {
        type: 0,
        environment: [],
    } as any;

    public categories: ICategory[] = [];

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

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.form.valid) {
            return;
        }
        const data = this.dataForm().value() as any;
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
