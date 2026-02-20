import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { IItem } from '../../../theme/models/seo';
import { GenerateService } from '../generate.service';
import { ITableHeaderItem } from '../../../components/desktop/editable-table/model';
import { form, required } from '@angular/forms/signals';
import { ArraySource, ButtonEvent } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-database',
    templateUrl: './database.component.html',
    styleUrls: ['./database.component.scss']
})
export class DatabaseComponent {
    private readonly service = inject(GenerateService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<any[]>([]);
    public headerItems: ITableHeaderItem[] = [
        {name: 'name', label: '数据库'},
        {name: 'collation', label: '排序规则'},
    ];

    public readonly collationItems = ArraySource.from([
        {name: 'UTF8编码', value: 'utf8_general_ci'},
        {name: 'UTF8M64编码', value: 'utf8mb4_general_ci'},
    ]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal({
        name: '',
        collation: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.isLoading.set(true);
        this.service.schemaList(true).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data.map(i => {
                return {
                    name: i
                };
            }));
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.editForm().invalid()) {
            this.toastrService.warning('请输入数据库名');
            return;
        }
        e?.enter();
        this.service.schemaCreate({...this.editForm().value()}).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('创建成功');
                this.editForm.name().value.set('');
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
    }

}
