import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CommentComponent } from './comment/comment.component';
import { LiveComponent } from './live/live.component';
import { MovieAreaComponent } from './movie/area/movie-area.component';
import { EditMovieComponent } from './movie/edit/edit-movie.component';
import { MovieFileComponent } from './movie/file/movie-file.component';
import { MovieComponent } from './movie/movie.component';
import { MovieScoreComponent } from './movie/score/movie-score.component';
import { SeriesComponent } from './movie/series/series.component';
import { MusicComponent } from './music/music.component';
import { TagComponent } from './tag/tag.component';
import { TvBackendComponent } from './tv-backend.component';

const routes: Routes = [
    {
        path: 'comment',
        component: CommentComponent,
    },
    {
        path: 'tag',
        component: TagComponent,
    },
    {
        path: 'category',
        component: CategoryComponent,
    },
    {
        path: 'live',
        component: LiveComponent,
    },
    {
        path: 'music',
        component: MusicComponent,
    },
    {
        path: 'movie/create',
        component: EditMovieComponent,
    },
    {
        path: 'movie/edit/:id',
        component: EditMovieComponent,
    },
    {
        path: 'movie/score/:movie',
        component: MovieScoreComponent,
    },
    {
        path: 'movie/:movie/file',
        component: MovieFileComponent,
    },
    {
        path: 'movie/:movie/series/:series',
        component: MovieFileComponent,
    },
    {
        path: 'movie/:movie/series',
        component: SeriesComponent,
    },
    {
        path: 'movie',
        component: MovieComponent,
    },
    {
        path: 'area',
        component: MovieAreaComponent,
    },
    {
        path: '',
        component: TvBackendComponent
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackendRoutingModule {}

export const backendRoutedComponents = [
    TvBackendComponent, LiveComponent, MusicComponent,
    MovieComponent, MovieFileComponent, SeriesComponent, MovieScoreComponent, EditMovieComponent, MovieAreaComponent, 
    CommentComponent, TagComponent, CategoryComponent,
];
