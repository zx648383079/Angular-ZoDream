import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMicro } from '../model';
import { IDataOne, IPage } from '../../../theme/models/page';

@Injectable()
export class MicroService {
    private http = inject(HttpClient);


    public microList(params: any) {
        return this.http.get<IPage<IMicro>>('micro/publish', {params});
    }

    
    public microSave(data: any) {
        return this.http.post<IMicro>('micro/publish/save', data);
    }

    public microRemove(id: any) {
        return this.http.delete<IDataOne<true>>('micro/publish/delete', {
            params: {id}
        });
    }
}
