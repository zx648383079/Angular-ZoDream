import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
        return;
    }
    if (!/^\d+$/.test(value)) {
        return value;
    }
    const date = new Date(parseInt(value, 10) * 1000);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  }

}
