import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'iconfont'
})
export class IconfontPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            return '';
        }
        if (value.indexOf(' ') >= 0) {
            value = value.split(' ')[1];
        }
        const map: any = {
            'fa-mail-bulk': 'icon-mail',
            'fa-rss': 'icon-share-alt',
        };
        return Object.hasOwn(map, value) ? map[value] : value.replace('fa-', 'icon-');
    }

}