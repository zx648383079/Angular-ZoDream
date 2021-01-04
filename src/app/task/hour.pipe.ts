import { Pipe, PipeTransform } from '@angular/core';
import { formatHour } from '../theme/utils';

@Pipe({
  name: 'hour'
})
export class HourPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    if (!value) {
      return '00:00';
    }
    return formatHour(value, undefined, true);
  }

}
