import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    ArticleComponent
} from './article/article.component';
import {
    ArticleDetailComponent
} from './article/detail/article-detail.component';
import {
    HelpComponent
} from './article/help/help.component';
import {
    AuthComponent
} from './auth/auth.component';
import {
    CartComponent
} from './cart/cart.component';
import {
    CategoryComponent
} from './category/category.component';
import {
    GoodsComponent
} from './goods/goods.component';
import {
    HomeComponent
} from './home/home.component';

import {
    MarketComponent
} from './market.component';
import {
    SearchComponent
} from './search/search.component';

const routes: Routes = [{
    path: '',
    component: MarketComponent,
    children: [{
            path: 'auth',
            component: AuthComponent
        },
        {
            path: 'category/:id',
            component: CategoryComponent
        },
        {
            path: 'goods/:id',
            component: GoodsComponent
        },
        {
            path: 'search',
            component: SearchComponent
        },
        {
            path: 'cart',
            component: CartComponent
        },
        {
            path: 'article/help',
            component: HelpComponent
        },
        {
            path: 'article/:id',
            component: ArticleDetailComponent
        },
        {
            path: 'article',
            component: ArticleComponent
        },
        {
            path: '',
            component: HomeComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarketRoutingModule {}

export const marketRoutingComponents = [
    MarketComponent, HomeComponent, AuthComponent,
    CategoryComponent, SearchComponent, GoodsComponent,
    CartComponent, ArticleDetailComponent, HelpComponent, ArticleComponent
];
