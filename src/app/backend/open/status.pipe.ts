import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number): string {
    if (value < 1) {
      return '无';
    }
    if (value === 1) {
      return '正常';
    }
    if (value === 9) {
      return '审核中';
    }
    return '';
  }

}
