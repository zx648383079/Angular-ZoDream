import { Pipe, PipeTransform } from '@angular/core';
import { mapFormat } from '../../theme/utils';

@Pipe({
    standalone: false,
    name: 'logType'
})
export class LogTypePipe implements PipeTransform {

    transform(value: number): string {
        return mapFormat(value, ['支出', '收入', '借出', '借入']);
    }

}
