import {
    HttpClient
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import {
    IData,
    IDataOne,
    IPage
} from '../../theme/models/page';
import {
    IAd,
    IAdPosition
} from './model';

@Injectable()
export class AdService {

    constructor(private http: HttpClient) {}

    public adList(params: any) {
        return this.http.get<IPage<IAd>>('ad/admin/ad', {
            params,
        });
    }

    public ad(id: any) {
        return this.http.get<IAd>('ad/admin/ad/detail', {
            params: {
                id
            },
        });
    }

    public adSave(data: any) {
        return this.http.post<IAd>('ad/admin/ad/save', data);
    }

    public adRemove(id: any) {
        return this.http.delete<IDataOne<true>>('ad/admin/ad/delete', {
            params: {
                id
            }
        });
    }

    public positionList(params: any) {
        return this.http.get<IPage<IAdPosition>>('ad/admin/ad/position', {
            params,
        });
    }

    public position(id: any) {
        return this.http.get<IAdPosition>('ad/admin/ad/detail_position', {
            params: {
                id
            },
        });
    }

    public positionSave(data: any) {
        return this.http.post<IAdPosition>('ad/admin/ad/save_position', data);
    }

    public positionRemove(id: any) {
        return this.http.delete<IDataOne<true>>('ad/admin/ad/delete_position', {
            params: {
                id
            }
        });
    }

    public positionAll() {
        return this.http.get<IData<IAdPosition>>('ad/admin/ad/position_all');
    }

    public statistics() {
        return this.http.get<any>('ad/admin/statistics');
    }
}
