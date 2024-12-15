import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'attributeType'
})
export class AttributeTypePipe implements PipeTransform {

    transform(value: number): string {
        const items = ['唯一属性', '单选属性', '复选属性'];
        return items[value];
    }

}
