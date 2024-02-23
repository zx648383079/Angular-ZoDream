import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'iconfont'
})
export class IconfontPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            return '';
        }
        if (value.indexOf(' ')) {
            value = value.split(' ')[1];
        }
        const map = {
            'fa-mail-bulk': 'icon-mail',
            'fa-rss': 'icon-share-alt',
        };
        return Object.prototype.hasOwnProperty.call(map, value) ? map[value] : value.replace('fa-', 'icon-');
    }

}