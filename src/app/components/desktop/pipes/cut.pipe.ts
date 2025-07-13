import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'cut'
})
export class CutPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return null;
    }

}
