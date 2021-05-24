import { Component, OnInit } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../dialog';
import { IOption } from '../../theme/models/seo';
import { emptyValidate } from '../../theme/validators';
import { SystemService } from './system.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

    public groups: IOption[] = [];

    public editData: IOption = {} as any;
    public typeItems = [
        {
            value: 'group',
            name:'分组'
        }, 
        {value: 'text', name: '文本'},
        {value: 'textarea', name: '多行文本'},
        {value: 'select', name: '下拉选择'},
        {value: 'radio', name: '单选'},
        {value: 'checkbox', name: '多选'},
        {value: 'switch', name: '开关'},
        {value: 'image', name: '图片'},
        {value: 'file', name: '文件'},
        {value: 'basic_editor', name: '迷你编辑器'},
        {value: 'editor', name: '编辑器'},
        {value: 'json', name: 'JSON'},
        {value: 'hide', name: '隐藏'}
    ];

    constructor(
        private service: SystemService,
        private toastrService: DialogService,
    ) {
        this.service.optionList().subscribe(res => {
            this.groups = res.data.map(group => {
                if (!group.children) {
                    group.children = [];
                }
                group.children = group.children.map(item => {
                    if (['select', 'radio', 'checkbox'].indexOf(item.type)) {
                        item.items = this.strToArr(item.default_value);
                    }
                    if (item.type === 'checkbox') {
                        item.values = item.value.split(',');
                    }
                    return item;
                });
                return group;
            });
        });
    }

    ngOnInit(): void {}

    private strToArr(val: any): string[] {
        if (typeof val === 'object') {
            return val;
        }
        const items: string[] = [];
        val.toString().split('\n').forEach((item: string) => {
            item = item.replace('\r', '').trim();
            if (!item || item.length < 1) {
                return;
            }
            if (items.indexOf(item) >= 0) {
                return;
            }
            items.push(item);
        });
        return items;
    }

    public tapSubmit() {
        const option: any = {};
        for (const group of this.groups) {
            for (const item of group.children) {
                option[item.id] = item.value;
            }
        }
        this.service.optionSave({
            option
        }).subscribe({
            next: () => {
                this.toastrService.success('保存成功');
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }


    public tapAddGroup(modal: any) {
        this.editData = {
            name: '',
            code: '',
            parent_id: 0,
            type: 'group',
            visibility: 1,
            default_value: '',
            value: '',
            position: 99,
        };
        this.tapOpenModal(modal);
    }

    public tapEditOption(modal: any, item: IOption) {
        this.editData = item;
        this.tapOpenModal(modal);
    }

    public tapOpenModal(modal: DialogBoxComponent) {
        modal.openCustom(value => {
            if (value === 'remove') {
                if (!confirm('确定删除此项')) {
                    return;
                }
                this.service.optionRemove(this.editData.id).subscribe(res => {
                    this.toastrService.success('删除成功');
                    this.removeOption(this.editData);
                });
                return;
            }
            if (emptyValidate(this.editData.name)) {
                return false;
            }
            this.service.optionSaveField(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
                }, error: err => {
                    this.toastrService.warning(err.error.message);
                }
            });
        })
    }

    private removeOption(item: IOption) {
        const groups = this.groups;
        all:
            for (let i = 0; i < groups.length; i++) {
                const group = this.groups[i];
                if (group.id === item.id) {
                    groups.splice(i, 1);
                    break;
                }
                for (let j = 0; j < group.children.length; j++) {
                    if (group.children[j].id === item.id) {
                        group.children.splice(j, 1);
                        break all;
                    }
                }
            }
        this.groups = groups;
    }
}
