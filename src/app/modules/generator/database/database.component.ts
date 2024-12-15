import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { ITableHeaderItem } from '../../../theme/components/editable-table/model';
import { IItem } from '../../../theme/models/seo';
import { emptyValidate } from '../../../theme/validators';
import { GenerateService } from '../generate.service';

@Component({
    standalone: false,
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

    public items: any[] = [];
    public headerItems: ITableHeaderItem[] = [
        {name: 'name', label: '数据库'},
        {name: 'collation', label: '排序规则'},
    ];

    public collationItems: IItem[] = [
        {name: 'UTF8编码', value: 'utf8_general_ci'},
        {name: 'UTF8M64编码', value: 'utf8mb4_general_ci'},
    ];
    public isLoading = false;
    public editData = {
        name: '',
        collation: '',
    };

    constructor(
        private service: GenerateService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.service.schemaList(true).subscribe(res => {
            this.isLoading = false;
            this.items = res.data.map(i => {
                return {
                    name: i
                };
            });
        });
    }

    public tapSubmit() {
        if (emptyValidate(this.editData.name)) {
            this.toastrService.warning('请输入数据库名');
            return;
        }
        this.service.schemaCreate({...this.editData}).subscribe({
            next: _ => {
                this.toastrService.success('创建成功');
                this.editData.name = '';
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }

}
