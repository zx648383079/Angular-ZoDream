import { Pipe, PipeTransform } from '@angular/core';
import { assetUri } from '../../../theme/utils';

@Pipe({
    standalone: false,
    name: 'asset'
})
export class AssetPipe implements PipeTransform {

    transform(value?: string, args?: any): any {
        return assetUri(value);
    }

}
