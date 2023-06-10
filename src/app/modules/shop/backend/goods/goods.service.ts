import {
    Injectable
} from '@angular/core';
import {
    HttpClient
} from '@angular/common/http';
import {
    IData,
    IDataOne,
    IPage
} from '../../../../theme/models/page';
import {
    IAttributeGroup,
    IBrand,
    ICategory,
    IGoods,
    IGoodsAttribute,
    IGoodsCard,
    IIssue
} from '../../model';

@Injectable()
export class GoodsService {

    constructor(
        private http: HttpClient
    ) {}

    /**
     * get
     */
    public get(params: any) {
        return this.http.get<IPage<IGoods>>('shop/admin/goods', {
            params
        });
    }

    public goods(id: any) {
        return this.http.get<IGoods>('shop/admin/goods/detail', {
            params: {
                id
            },
        });
    }

    public goodsPreview(id: any) {
        return this.http.get<IGoods>('shop/admin/goods/preview', {
            params: {
                id
            },
        });
    }

    public goodsSave(data: any) {
        return this.http.post<IGoods>('shop/admin/goods/save', data);
    }

    public goodsToggle(data: any) {
        return this.http.post<IDataOne<true>>('shop/admin/goods/toggle', data);
    }

    public goodsRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/goods/delete', {
            params: {
                id
            }
        });
    }

    public createSn() {
        return this.http.get<IDataOne<string>>('shop/admin/goods/generate_sn');
    }

    public trashRemove(id: any) {
        return this.http.delete< IDataOne<true>>('shop/admin/goods/delete', {
            params: {
                id,
                trash: 'true'
            }
        });
    }

    public trashClear() {
        return this.http.delete< IDataOne<true>>('shop/admin/goods/clear');
    }

    public trashRestore(id?: any) {
        return this.http.post< IDataOne<true>>('shop/admin/goods/restore', {id});
    }

    public goodsAttribute(groupId: number, goodsId = 0) {
        return this.http.get<IGoodsAttribute>('shop/admin/goods/attribute', {
            params: {group_id: groupId.toString(), goods_id: goodsId.toString()}
        });
    }

    public category(id: any) {
        return this.http.get<ICategory>('shop/admin/category/detail', {
            params: {
                id
            },
        });
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('shop/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/category/delete', {
            params: {
                id
            }
        });
    }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('shop/admin/category');
    }

    public categoryAll() {
        return this.http.get<IData<ICategory>>('shop/admin/category/all');
    }

    public brandList(params: any) {
        return this.http.get<IPage<IBrand>>('shop/admin/brand', {
            params,
        });
    }

    public brand(id: any) {
        return this.http.get<IBrand>('shop/admin/brand/detail', {
            params: {
                id
            },
        });
    }

    public brandSave(data: any) {
        return this.http.post<IBrand>('shop/admin/brand/save', data);
    }

    public brandRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/brand/delete', {
            params: {
                id
            }
        });
    }

    public brandAll() {
        return this.http.get<IData<IBrand>>('shop/admin/brand/all');
    }

    public cardList(params: any) {
        return this.http.get<IPage<IGoodsCard>>('shop/admin/goods/card', {
            params,
        });
    }

    public cardRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/goods/card_delete', {
            params: {
                id
            }
        });
    }

    public cardGenerate(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/admin/goods/card_generate', data);
    }

    public cardImport(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/admin/goods/card_import', data);
    }

    public search(params: any) {
        return this.http.get<IPage<IGoods>>('shop/admin/goods/search', {
            params
        });
    }

    public issueList(params: any) {
        return this.http.get<IPage<IIssue>>('shop/admin/goods/issue', {
            params,
        });
    }

    public issueSave(data: any) {
        return this.http.post<IDataOne<boolean>>('shop/admin/goods/issue_save', data);
    }

    public issueRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/goods/issue_delete', {
            params: {
                id
            }
        });
    }

    public batch(data: {
        category?: any;
        brand?: any;
        group?: any;
    }) {
        return this.http.post<{
            category?: ICategory[];
            brand?: IBrand[];
            group?: IAttributeGroup[];
        }>('shop/admin/batch', data);
    }
}
