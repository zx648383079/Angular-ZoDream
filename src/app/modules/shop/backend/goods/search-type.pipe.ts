import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'searchType'
})
export class SearchTypePipe implements PipeTransform {

    transform(value: number): string {
        const items = ['不需要检索', '关键字检索', '范围检索'];
        return items[value];
    }

}
