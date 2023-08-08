import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { ICateringAddress, ICateringCategory, ICateringOrder, ICateringPatron, ICateringPatronGroup, ICateringProduct, ICateringPurchaseOrder, ICateringRecipe, ICateringStaff, ICateringStaffRole, ICateringStock, ICateringStore } from './model';

@Injectable({
  providedIn: 'root'
})
export class CateringService {

    constructor(
        private http: HttpClient
    ) { }

    public categoryList() {
        return this.http.get<IData<ICateringCategory>>('catering/category');
    }

    public productList(params: any) {
        return this.http.get<IPage<ICateringProduct>>('catering/product', {params});
    }

    public product(id: any) {
        return this.http.get<ICateringProduct>('catering/product/detail', {params: {id}});
    }

    public addressList(params: any) {
        return this.http.get<IPage<ICateringAddress>>('catering/address', {params});
    }

    public orderList(params: any) {
        return this.http.get<IPage<ICateringOrder>>('catering/order', {params});
    }

    public waiterOrderList(params: any) {
        return this.http.get<IPage<ICateringOrder>>('catering/waiter/order', {params});
    }

    public waiterLogList(params: any) {
        return this.http.get<IPage<ICateringOrder>>('catering/waiter/log', {params});
    }

    public merchantOrderList(params: any) {
        return this.http.get<IPage<ICateringOrder>>('catering/merchant/order', {params});
    }

    public merchantProductList(params: any) {
        return this.http.get<IPage<ICateringProduct>>('catering/merchant/product', {params});
    }

    public merchantProductCategory() {
        return this.http.get<IData<ICateringCategory>>('catering/merchant/product/category');
    }

    public merchantProductCategorySave(data: any) {
        return this.http.post<ICateringCategory>('catering/merchant/product/category_save', data);
    }

    public merchantProductCategoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('catering/merchant/product/category_delete', {params: {id}});
    }

    public merchantPatronList(params: any) {
        return this.http.get<IPage<ICateringPatron>>('catering/merchant/patron', {params});
    }

    public merchantPatronGroup() {
        return this.http.get<IData<ICateringPatronGroup>>('catering/merchant/patron/group');
    }

    public merchantPatronGroupSave(data: any) {
        return this.http.post<ICateringPatronGroup>('catering/merchant/patron/group_save', data);
    }

    public merchantPatronGroupRemove(id: any) {
        return this.http.delete<IDataOne<true>>('catering/merchant/patron/group_delete', {params: {id}});
    }

    public merchantStaffList(params: any) {
        return this.http.get<IPage<ICateringStaff>>('catering/merchant/staff', {params});
    }

    public merchantStaffRole() {
        return this.http.get<IData<ICateringStaffRole>>('catering/merchant/staff/role');
    }

    public merchantStaffRoleSave(data: any) {
        return this.http.post<ICateringStaffRole>('catering/merchant/staff/role_save', data);
    }

    public merchantStaffRoleRemove(id: any) {
        return this.http.delete<IDataOne<true>>('catering/merchant/staff/role_delete', {params: {id}});
    }

    public merchantStockList(params: any) {
        return this.http.get<IPage<ICateringStock>>('catering/merchant/stock', {params});
    }

    public merchantStockCategory() {
        return this.http.get<IData<ICateringCategory>>('catering/merchant/stock/category');
    }

    public merchantStockCategorySave(data: any) {
        return this.http.post<ICateringCategory>('catering/merchant/stock/category_save', data);
    }

    public merchantStockCategoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('catering/merchant/stock/category_delete', {params: {id}});
    }

    public merchantPurchaseOrderList(params: any) {
        return this.http.get<IPage<ICateringPurchaseOrder>>('catering/merchant/stock/order', {params});
    }

    public merchantRecipeList(params: any) {
        return this.http.get<IPage<ICateringRecipe>>('catering/merchant/recipe', {params});
    }

    public merchantRecipeCategory() {
        return this.http.get<IData<ICateringCategory>>('catering/merchant/recipe/category');
    }

    public merchantRecipeCategorySave(data: any) {
        return this.http.post<ICateringCategory>('catering/merchant/recipe/category_save', data);
    }

    public merchantRecipeCategoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('catering/merchant/recipe/category_delete', {params: {id}});
    }

    public merchantSetting() {
        return this.http.get<any>('catering/merchant/setting');
    }

    public merchantSettingSave(data: any) {
        return this.http.post<ICateringStore>('catering/merchant/setting/save', data);
    }

    
    public merchantUploadLogo(file: File) {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<ICateringStore>('catering/merchant/setting/logo', form);
    }

    public batch(data: {
        profile: any;
    }) {
        return this.http.post<{
            profile: {
                is_waiter: boolean;
                has_store: boolean;
            };
        }>('catering/batch', data);
    }
}
