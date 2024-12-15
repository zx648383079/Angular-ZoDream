import { Pipe, PipeTransform } from '@angular/core';
import { parseNumber } from '../utils';

@Pipe({
    standalone: false,
    name: 'size'
})
export class SizePipe implements PipeTransform {

    transform(value: any, args?: any): string {
        if (typeof value === 'undefined' || value === null) {
            return '--';
        }
        value = parseNumber(value);
        if (value === 0) {
            return '0 B';
        }
        const k = 1000; // or 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(value) / Math.log(k));
        return (value / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

}
