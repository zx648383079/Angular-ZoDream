import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'status'
})
export class StatusPipe implements PipeTransform {

    transform(value: number): string {
        if (value < 1) {
            return '未处理';
        }
        if (value === 1) {
            return '已阅';
        }
        if (value === 2) {
            return '已处理';
        }
        if (value === 3) {
            return '已忽略';
        }
        return '未知';
    }
}
