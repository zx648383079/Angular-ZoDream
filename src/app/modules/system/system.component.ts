import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DialogBoxComponent, DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { IItem, IOption } from '../../theme/models/seo';
import { eachObject, parseNumber, splitStr } from '../../theme/utils';
import { emptyValidate } from '../../theme/validators';
import { SystemService } from './system.service';
import { form, required } from '@angular/forms/signals';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.scss']
})
export class SystemComponent {
    private readonly service = inject(SystemService);
    private readonly toastrService = inject(DialogService);


    public readonly groups = signal<IOption[]>([]);
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        code: '',
        parent_id: '0',
        type: 'group',
        visibility: '1',
        default_value: '',
        value: '',
        position: 99,
    }), schemaPath => {
        required(schemaPath.name);
    });
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
    public visibleItems = ['隐藏', '后台可见', '前台可见'];
    public readonly form = computed(() => {
        const items = this.groups();
        const groups: any = {};
        for (const group of items) {
            for (const item of group.children) {
                groups[item.code] = new FormControl(typeof item.value === 'undefined' ? '' : item.value);
            }
        }
        return new FormGroup(groups);
    });

    constructor() {
        this.service.optionList().subscribe(res => {
            this.groups.set(res.data.map(group => {
                if (!group.children) {
                    group.children = [];
                }
                group.children = group.children.map(item => this.formatOptionItem(item));
                return group;
            }));
        });
    }

    private formatOptionItem(item: IOption): IOption {
        let isInt = false;
        if (['select', 'radio', 'checkbox'].indexOf(item.type) >= 0) {
            item.items = this.strToArr(item.default_value);
            item.itemKey = 1;
            if (item.items instanceof Array && typeof item.items[0] === 'object') {
                item.itemKey = 'value';
            }
            isInt = this.isIntValue(item.items);
        }
        if (item.type === 'checkbox') {
            item.values = (item.value as string).split(',').map(i => {
                if (isInt) {
                    return parseNumber(i);
                }
                return i;
            });
        } else if (isInt) {
            item.value = parseNumber(item.value);
        }
        return item;
    }

    private isIntValue(items: string[]|IItem[]): boolean {
        if (!(items instanceof Array)) {
            return true;
        }
        for (const item of items) {
            if (typeof item !== 'object') {
                return true;
            }
            if (typeof item.value === 'number') {
                return true;
            }
            return false;
        }
        return false;
    }

    private strToArr(val: any): string[]|IItem[] {
        if (typeof val === 'object') {
            return val;
        }
        const items: any[] = [];
        val.toString().split('\n').forEach((item: string, i: number) => {
            let key: number|string = i;
            item = item.replace('\r', '').trim();
            if (!item || item.length < 1) {
                return;
            }
            if (item.indexOf(':') > 0) {
                [key, item] = splitStr(item, ':', 2);
            }
            items.push({
                name: item,
                value: key
            });
        });
        return items;
    }

    public tapSubmit(e?: ButtonEvent) {
        const option = this.form().getRawValue();
        e?.enter();
        this.service.optionSave({
            option
        }).subscribe({
            next: () => {
                this.toastrService.success($localize `Save Successfully`);
                e?.reset();
            },
            error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }


    public tapAddGroup(modal: any) {
        this.editForm().value.set({
            id: 0,
            name: '',
            code: '',
            parent_id: '0',
            type: 'group',
            visibility: '1',
            default_value: '',
            value: '',
            position: 99,
        });
        this.tapOpenModal(modal);
    }

    public tapEditOption(modal: any, item: IOption) {
        this.editForm().value.set(item as any);
        this.tapOpenModal(modal);
    }

    public tapOpenModal(modal: DialogBoxComponent) {
        modal.openCustom(value => {
            if (!value) {
                return;
            }
            const data = this.editForm().value();
            if (value === 'remove') {
                this.toastrService.confirm('确定删除此项', () => {
                    this.service.optionRemove(data.id).subscribe(res => {
                        this.toastrService.success($localize `Delete Successfully`);
                        this.removeOption(data as any);
                    });
                });
                return;
            }
            if (emptyValidate(data.name)) {
                this.toastrService.warning('显示名称必填');
                return false;
            }
            if (data.type !== 'group') {
                if (!data.parent_id) {
                    this.toastrService.warning('请选择分组');
                    return false;
                }
                if (emptyValidate(data.code)) {
                    this.toastrService.warning('别名必填');
                    return false;
                }
            }
            this.service.optionSaveField(data).subscribe({
                next: res => {
                    this.addOption(res);
                    this.toastrService.success($localize `Save Successfully`); 
                }, error: err => {
                    this.toastrService.warning(err.error.message);
                }
            });
        })
    }

    private addOption(item: IOption) {
        item.id = parseNumber(item.id);
        item.parent_id = parseNumber(item.parent_id);
        if (item.type !== 'group') {
            item = this.formatOptionItem(item);
        }
        for (let i = 0; i < this.groups.length; i++) {
            const group = this.groups[i];
            if (item.id === group.id) {
                group.name = item.name;
                return;
            }
            if (item.type === 'group') {
                continue;
            }
            for (let j = group.children.length - 1; j >= 0; j--) {
                const child = group.children[j];
                if (child.id !== item.id) {
                    continue;
                }
                if (child.parent_id !== item.parent_id) {
                    group.children.splice(j, 1);
                    break;
                }
                group.children[j] = item;
                return;
            }
            if (item.parent_id !== group.id) {
                continue;
            }
            group.children.push(item);
        }
        if (item.type !== 'group') {
            return;
        }
        item.children = [];
        this.groups.update(v => {
            return [...v, item];
        });
    }


    private removeOption(item: IOption) {
        const groups = this.groups();
        all:
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
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
        this.groups.set(groups);
    }
}
