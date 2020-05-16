import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'asset'
})
export class AssetPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value) {
      return null;
    }
    if (value.indexOf('//') >= 0) {
      return value;
    }
    if (value.startsWith('/')) {
      return environment.assetUri + value;
    }
    return environment.assetUri + '/' + value;
  }

}
