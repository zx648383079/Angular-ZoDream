import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IOption } from '../../../../../theme/models/seo';
import { emptyValidate } from '../../../../../theme/validators';
import { CmsService } from '../../cms.service';
import { form } from '@angular/forms/signals';
import { eachObject } from '../../../../../theme/utils';
import { ButtonEvent } from '../../../../../components/form';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-site-option',
    templateUrl: './site-option.component.html',
    styleUrls: ['./site-option.component.scss']
})
export class SiteOptionComponent {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);
    public readonly items = signal<IOption[]>([]);

    public readonly editForm = form(signal({
        id: 0,
        name: '',
        code: '',
        type: 'text',
        default_value: '',
        value: '',
    }));
    public typeItems = [
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
    ];

    private id = 0;

    public readonly form = computed(() => {
        const items = this.items();
        const groups: any = {};
        for (const item of items) {
            groups[item.code] = new FormControl(typeof item.value === 'undefined' ? '' : item.value);
        }
        return new FormGroup(groups);
    });

    constructor() {
        this.route.params.subscribe(params => {
            this.id = parseInt(params.id, 10);
            this.service.option(this.id).subscribe(res => {
                this.items.set(res.data.map(item => {
                    if (['select', 'radio', 'checkbox'].indexOf(item.type)) {
                        item.items = this.strToArr(item.default_value);
                    }
                    if (item.type === 'checkbox') {
                        item.values = item.value.split(',');
                    }
                    return item;
                }));
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

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

    public tapSubmit(e?: ButtonEvent) {
        e?.enter();
        const data = this.form().getRawValue();
        this.service.optionSave(this.id, this.items().map(item => {
            return {
                ...item, value: data[item.code]
            }
        })).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.location.back();
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapEditOption(modal: any, item?: IOption) {
        this.editForm().value.update(v => {
            v.name = item?.name ?? '';
            v.code = item?.code ?? '';
            v.type = item?.type ?? 'text';
            v.default_value = item?.default_value ?? '';
            v.value = item?.value as any ?? '';
            return {...v};
        });
        this.tapOpenModal(modal);
    }

    public tapOpenModal(modal: DialogEvent) {
        modal.openCustom(value => {
            if (value === 'remove') {
                if (!confirm('确定删除此项')) {
                    return;
                }
                this.items.update(v => {
                    return v.filter(i => {
                        return i.code !== i.code;
                    });
                });
                return;
            }
            const data = this.editForm().value();
            if (emptyValidate(data.code)) {
                return false;
            }
            this.items.update(v => {
                for (const item of v) {
                    if (item.code === data.code) {
                        eachObject(data, (vk, k) => {
                            item[k] = vk;
                        });
                        return [...v];
                    }
                }
                v.push(data as any);
                return [...v];
            });
            
        });
    }

}
