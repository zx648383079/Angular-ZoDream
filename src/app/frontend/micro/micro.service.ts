import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPage } from 'src/app/theme/models/page';
import { IMicro } from 'src/app/theme/models/micro';
import { mockPage } from 'src/app/theme/mock/page';
import { mockMicro } from 'src/app/theme/mock/micro';

@Injectable()
export class MicroService {

    constructor() { }

    public getPgae(param: any): Observable<IPage<IMicro>> {
        return of(mockPage(mockMicro));
    }
}
