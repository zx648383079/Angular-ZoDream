import {
    HttpClient
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import { IData, IDataOne, IPage } from '../../theme/models/page';
import { IArticle, IArticleCategory } from '../../theme/models/shop';

@Injectable()
export class ArticleService {

    constructor(
        private http: HttpClient,
    ) {}

    public articleList(params: any) {
        return this.http.get<IPage<IArticle>>('shop/admin/article', {
            params,
        });
    }

    public article(id: any) {
        return this.http.get<IArticle>('shop/admin/article/detail', {
            params: {
                id
            },
        });
    }

    public articleSave(data: any) {
        return this.http.post<IArticle>('shop/admin/article/save', data);
    }

    public articleRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/article/delete', {
            params: {
                id
            }
        });
    }

    public categoryList(params: any) {
        return this.http.get<IPage<IArticleCategory>>('shop/admin/category', {
            params,
        });
    }

    public category(id: any) {
        return this.http.get<IArticleCategory>('shop/admin/article/detail_category', {
            params: {
                id
            },
        });
    }

    public categorySave(data: any) {
        return this.http.post<IArticleCategory>('shop/admin/article/save_category', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<true>>('shop/admin/article/delete_category', {
            params: {
                id
            }
        });
    }

    public categoryTree() {
        return this.http.get<IData<IArticleCategory>>('shop/admin/article/category_tree');
    }

}
