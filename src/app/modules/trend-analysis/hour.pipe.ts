import { Pipe, PipeTransform } from '@angular/core';
import { formatHour } from '../../theme/utils';

@Pipe({
    name: 'hour'
})
export class HourPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return formatHour(value, 'hh:ii:ss', true);
    }

}
