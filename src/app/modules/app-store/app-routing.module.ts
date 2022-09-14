import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppStoreComponent } from './app-store.component';
import { CategoryComponent } from './category/category.component';
import { CommentComponent } from './detail/comment/comment.component';
import { DetailComponent } from './detail/detail.component';
import { ScoreComponent } from './detail/score/score.component';
import { VersionComponent } from './detail/version/version.component';
import { HomeComponent } from './home/home.component';
import { DownloadComponent } from './member/download/download.component';
import { HistoryComponent } from './member/history/history.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
    {
        path: '',
        component: AppStoreComponent,
        children: [
            {
                path: 'category/:category/:id',
                component: DetailComponent
            },
            {
                path: 'category/:id',
                component: CategoryComponent
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
                path: 'download/history',
                component: HistoryComponent
            },
            {
                path: 'download',
                component: DownloadComponent
            },
            {
                path: '',
                component: HomeComponent
            },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppStoreRoutingModule { }

export const appStoreRoutedComponents = [
    AppStoreComponent, HomeComponent, DownloadComponent, HistoryComponent, SearchComponent, CategoryComponent, DetailComponent, CommentComponent,
    ScoreComponent,
    VersionComponent
];
