import { Pipe, PipeTransform } from '@angular/core';
import { formatHour } from '../../../theme/utils';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    if (!value) {
      return '00:00';
    }
    return formatHour(value, undefined, true);
  }

}
