import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { ICategory, ILive, IMovie, IMovieArea, IMusic } from './model';

@Injectable({
  providedIn: 'root'
})
export class TvService {
    private http = inject(HttpClient);


    
    public categoryList(params: any) {
        return this.http.get<IData<ICategory>>('tv/category', {params});
    }

    public liveList() {
        return this.http.get<IData<ILive>>('tv/live');
    }

    public movieList(params: any) {
        return this.http.get<IPage<IMovie>>('tv/movie', {params});
    }

    public movie(id: any) {
        return this.http.get<IMovie>('tv/movie/detail', {params: {id}});
    }

    public movieSeries(movie: any) {
        return this.http.get<IMovie>('tv/movie/series', {params: {movie}});
    }

    public movieSuggest(params: any) {
        return this.http.get<IData<IMovie>>('tv/movie/suggest', {params});
    }

    public musicList(params: any) {
        return this.http.get<IPage<IMusic>>('tv/music', {params});
    }

    public musicSuggest(params: any) {
        return this.http.get<IData<IMusic>>('tv/music/suggest', {params});
    }

    public batch(data: {
        categories?: any;
        areas?: any;
    }) {
        return this.http.post<{
            categories?: ICategory[];
            areas?: IMovieArea[];
        }>('tv/batch', data);
    }
}
