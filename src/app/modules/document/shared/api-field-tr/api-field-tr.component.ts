import { Component, input, model } from '@angular/core';
import { IApiField } from '../../model';

@Component({
    standalone: false,
    selector: 'app-doc-api-field-tr',
    templateUrl: './api-field-tr.component.html',
    styleUrls: ['./api-field-tr.component.scss']
})
export class ApiFieldTrComponent {

    public readonly items = model<IApiField[]>([]);
    public readonly kind = input(1);

    public typeItems = [
        {
            value: 'string',
            name: '字符串(string)'
        }, {
            value: 'json',
            name: '字符串(json)'
        }, {
            value: 'number',
            name: '数字(number)'
        }, {
            value: 'float',
            name: '浮点型(float)'
        }, {
            value: 'double',
            name: '双精度浮点型(double)'
        }, {
            value: 'boolean',
            name: '布尔型(boolean)'
        }, {
            value: 'array',
            name: '数组(array)'
        }, {
            value: 'object',
            name: '对象(object)'
        }, {
            value: 'null',
            name: '对象(null)'
        },
    ];

    public onTypeChange(item: IApiField) {
        if (item.type == 'object' || item.type == 'array') {
            if (!item.children) {
                item.children = [];
            }
        }
    }

    public tapRemoveItem(i: number) {
        this.items.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

    public tapAddItem(parent?: IApiField) {
        let item: any;
        if (this.kind() === 1) {
            item = {
                name: '',
                title: '',
                type: 'string',
                is_required: 0,
                default_value: '',
                remark: '',
                level: parent ? parent.level + 1 : 0
            };
        } else {
            item = {
                name: '',
                title: '',
                type: 'string',
                mock: '',
                remark: '',
                level: parent ? parent.level + 1 : 0
            };
        }
        
        this.items.update(v => {
            if (parent) {
                if (!parent.children) {
                    parent.children = [item];
                } else {
                    parent.children.push(item);
                }
            } else {
                v.push(item);
            };
            return v;
        });
    }
}
