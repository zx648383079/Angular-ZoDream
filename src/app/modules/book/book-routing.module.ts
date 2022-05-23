import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import {
    BookComponent
} from './book.component';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list/list.component';
import { ChapterComponent } from './chapter/chapter.component';
import { ReaderComponent } from './reader/reader.component';
import { DetailComponent } from './list/detail/detail.component';
import { TopComponent } from './top/top.component';
import { BookDetailComponent } from './detail/book-detail.component';
import { EditListComponent } from './list/edit/edit-list.component';
import { SettingComponent } from './setting/setting.component';
import { BookEditorComponent } from './editor/book-editor.component';
import { CanActivateViaAuthGuard } from '../../theme/guards';

const routes: Routes = [
    {
        path: 'member/book/:id',
        component: BookEditorComponent,
    },
    {
        path: '',
        component: BookComponent,
        children: [
            {
                path: 'setting',
                component: SettingComponent,
            },
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'search',
                component: SearchComponent
            },
            {
                path: 'list/edit/:id',
                component: EditListComponent,
            },
            {
                path: 'list/create',
                component: EditListComponent,
            },
            {
                path: 'list/:id',
                component: DetailComponent
            },
            {
                path: 'list',
                component: ListComponent
            },
            {
                path: 'top',
                component: TopComponent
            },
            {
                path: 'chapter/:id',
                component: ChapterComponent
            },
            {
                path: 'reader/:book/:id',
                component: ReaderComponent
            },
            {
                path: 'member',
                loadChildren: () => import('./member/book-member.module').then(m => m.BookMemberModule),
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: ':id',
                component: BookDetailComponent
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule {}


export const bookRoutingComponents = [
    BookComponent,
    HomeComponent,
    CategoryComponent,
    SearchComponent,
    DetailComponent,
    ListComponent,
    ChapterComponent,
    ReaderComponent,
    TopComponent,
    BookDetailComponent,
    EditListComponent,
    SettingComponent,
    BookEditorComponent,
];
