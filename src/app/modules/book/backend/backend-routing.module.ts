import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorComponent } from './author/author.component';
import { AuthorDetailComponent } from './author/detail/author-detail.component';
import { BackendComponent } from './backend.component';
import { CategoryComponent } from './category/category.component';
import { ChapterComponent } from './chapter/chapter.component';
import { ChapterDetailComponent } from './chapter/detail/chapter-detail.component';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { SpiderComponent } from './spider/spider.component';

const routes: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: 'author/create',
        component: AuthorDetailComponent,
    },
    {
        path: 'author/:id',
        component: AuthorDetailComponent,
    },
    {
        path: 'author',
        component: AuthorComponent,
    },
    {
        path: 'list',
        component: ListComponent,
    },
    {
        path: 'book/create',
        component: DetailComponent,
    },
    {
        path: 'book/:id',
        component: DetailComponent,
    },
    {
        path: 'chapter/:book/:id',
        component: ChapterDetailComponent,
    },
    {
        path: 'chapter/:book',
        component: ChapterComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: '',
        component: BackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookBackendRoutingModule {}

export const bookBackendRoutingComponents = [
    BackendComponent, CategoryComponent, AuthorComponent, ListComponent, DetailComponent, ChapterDetailComponent, ChapterComponent,
    AuthorDetailComponent, HomeComponent, SpiderComponent
];
