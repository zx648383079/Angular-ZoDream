import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IAd, IAdPosition } from '../../theme/models/shop';

@Injectable()
export class AdService {

  constructor(private http: HttpClient) { }

  public adList(params: any) {
    return this.http.get<IPage<IAd>>('shop/admin/ad', {
        params,
    });
  }

  public ad(id: any) {
      return this.http.get<IAd>('shop/admin/ad/detail', {
          params: {
              id
          },
      });
  }

  public adSave(data: any) {
      return this.http.post<IAd>('shop/admin/ad/save', data);
  }

  public adRemove(id: any) {
      return this.http.delete<IDataOne<true>>('shop/admin/ad/delete', {
          params: {
              id
          }
      });
  }

  public positionList(params: any) {
      return this.http.get<IPage<IAdPosition>>('shop/admin/position', {
          params,
      });
  }

  public position(id: any) {
      return this.http.get<IAdPosition>('shop/admin/ad/detail_position', {
          params: {
              id
          },
      });
  }

  public positionSave(data: any) {
      return this.http.post<IAdPosition>('shop/admin/ad/save_position', data);
  }

  public positionRemove(id: any) {
      return this.http.delete<IDataOne<true>>('shop/admin/ad/delete_position', {
          params: {
              id
          }
      });
  }

  public positionAll() {
    return this.http.get<IData<IAdPosition>>('shop/admin/position_all');
}
}
