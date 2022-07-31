import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home/home.component';
import { LiveComponent } from './live/live.component';
import { MusicComponent } from './music/music.component';
import { PlayComponent } from './play/play.component';
import { SearchComponent } from './search/search.component';
import { TvComponent } from './tv.component';

const routes: Routes = [
    {
        path: '',
        component: TvComponent,
        children: [
            // {
            //     path: 'teleplay',
            //     component: CategoryComponent
            // },
            {
                path: 'category/:category/:movie/play/:series',
                component: PlayComponent
            },
            {
                path: 'category/:category/:id',
                component: DetailComponent
            },
            {
                path: 'category/:id',
                component: CategoryComponent
            },
            // {
            //     path: 'movie',
            //     component: CategoryComponent
            // },
            {
                path: 'music',
                component: MusicComponent
            },
            {
                path: 'play/:movie/:series',
                component: PlayComponent
            },
            {
                path: 'play/:movie',
                component: PlayComponent
            },
            {
                path: 'live',
                component: LiveComponent
            },
            {
                path: 'search',
                component: SearchComponent
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
export class TvRoutingModule { }

export const tvRoutedComponents = [
    TvComponent, CategoryComponent, HomeComponent, SearchComponent, PlayComponent, DetailComponent, LiveComponent, MusicComponent
];
