import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPage } from 'src/app/@theme/models/page';
import { IProduct } from 'src/app/@theme/models/product';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * get
   */
  public get(params: any): Observable<IPage<IProduct>> {
    return this.http.get<IPage<IProduct>>('shop/admin/goods', {
      params
    });
  }
}
