import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IApiField } from '../../model';

@Component({
    standalone: false,
  selector: 'app-doc-api-field-tr',
  templateUrl: './api-field-tr.component.html',
  styleUrls: ['./api-field-tr.component.scss']
})
export class ApiFieldTrComponent {

    @Input() public items: IApiField[] = [];
    @Input() public kind = 1;
    @Output() public itemsChange = new EventEmitter();

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

    constructor() { }
    
    public onValueChange() {
        this.itemsChange.emit(this.items);
    }

    public onTypeChange(item: IApiField) {
        if (item.type == 'object' || item.type == 'array') {
            if (!item.children) {
                item.children = [];
            }
        }
    }

    public tapRemoveItem(i: number) {
        this.items.splice(i, 1);
        this.itemsChange.emit(this.items);
    }

    public tapAddItem(parent?: IApiField) {
        let item: any;
        if (this.kind === 1) {
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
        if (parent) {
            if (!parent.children) {
                parent.children = [item];
            } else {
                parent.children.push(item);
            }
        } else {
            this.items.push(item);
        }
        this.itemsChange.emit(this.items);
    }
}
