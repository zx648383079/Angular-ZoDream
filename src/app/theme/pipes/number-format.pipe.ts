import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

    transform(value: number): string {
        if (!value) {
            return '0';
        }
        const prefix = value < 0 ? '-' : '';
        const val = value < 0 ? - value : value;
        const k = 10000;
        const sizes = ['', '万', '亿', '万亿'];
        if (val < k) {
            return prefix + val;
        }
        const i = Math.floor(Math.log(val) / Math.log(k));
        return prefix + ((val / Math.pow(k, i))).toFixed(2) + sizes[i];
    }

}
