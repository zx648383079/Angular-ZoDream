import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

    static formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false  // 不添加千位分隔符
    });

    transform(value: number, args?: any): string {
        if (!value) {
            return '0';
        }
        const prefix = value < 0 ? '-' : '';
        const val = value < 0 ? - value : value;
        const k = 10000;
        const sizes = ['', '万', '亿', '万亿'];
        if (val < k) {
            return prefix + this.format(val);
        }
        const i = Math.floor(Math.log(val) / Math.log(k));
        return prefix + this.format((val / Math.pow(k, i))) + sizes[i];
    }

    private format(val: number): string {
        return NumberFormatPipe.formatter.format(val);
    }

}
