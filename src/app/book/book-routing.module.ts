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

const routes: Routes = [{
    path: '',
    component: BookComponent,
    children: [
        {
            path: 'category',
            component: CategoryComponent
        },
        {
            path: 'search',
            component: SearchComponent
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
            path: 'chapter/:id',
            component: ChapterComponent
        },
        {
            path: 'reader/:id',
            component: ReaderComponent
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
export class BookRoutingModule {}


export const bookRoutingComponents = [
    BookComponent,
    HomeComponent,
    CategoryComponent,
    SearchComponent,
    DetailComponent,
    ListComponent,
    ChapterComponent,
    ReaderComponent
];
