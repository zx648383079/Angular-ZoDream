import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logType'
})
export class LogTypePipe implements PipeTransform {

    transform(value: number): string {
        return ['支出', '收入', '借出', '借入'][value];
    }

}
