import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IPage } from '../../theme/models/page';
import { ICategory, ILive, IMovie, IMusic } from './model';

@Injectable({
  providedIn: 'root'
})
export class TvService {

    constructor(
        private http: HttpClient
    ) { }

    
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
        return this.http.get<IData<IMovie>>('tv/movie/suggestion', {params});
    }

    public musicList(params: any) {
        return this.http.get<IPage<IMusic>>('tv/music', {params});
    }

    public musicSuggest(params: any) {
        return this.http.get<IData<IMusic>>('tv/music/suggestion', {params});
    }
}
