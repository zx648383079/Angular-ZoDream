import { Pipe, PipeTransform } from '@angular/core';
import { formatHour } from '../../theme/utils';

@Pipe({
    standalone: false,
    name: 'duration'
})
export class DurationPipe implements PipeTransform {

    transform(value: number, args?: any): string {
        return formatHour(value, undefined, true);
    }

}
