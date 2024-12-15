import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'twoPad'
})
export class TwoPadPipe implements PipeTransform {

    transform(time: number): string {
        if (time < 10) {
            return '0' + time;
        }
        return time + '';
    }

}
