import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUploadResult } from '../../../theme/models/open';
import { IData, IDataOne, IPage } from '../../../theme/models/page';
import { ICategory, IComment, ILive, IMovie, IMovieArea, IMovieFile, IMovieScore, IMovieSeries, IMusic, ITag } from '../model';

@Injectable({
    providedIn: 'root'
})
export class TVService {

    constructor(
        private http: HttpClient
    ) { }

    public categoryTree() {
        return this.http.get<IData<ICategory>>('tv/admin/category/all');
    }

    public category(id: any) {
        return this.http.get<ICategory>('tv/admin/category/detail', {params: {id}});
    }

    public categorySave(data: any) {
        return this.http.post<ICategory>('tv/admin/category/save', data);
    }

    public categoryRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/category/delete', {params: {id}});
    }


    public movieList(params: any) {
        return this.http.get<IPage<IMovie>>('tv/admin/movie', {params});
    }

    public movie(id: any) {
        return this.http.get<IMovie>('tv/admin/movie/detail', {params: {id}});
    }

    public movieSave(data: any) {
        return this.http.post<IMovie>('tv/admin/movie/save', data);
    }

    public movieRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/movie/delete', {params: {id}});
    }

    public scoreList(params: any) {
        return this.http.get<IPage<IMovieScore>>('tv/admin/movie/score', {params});
    }

    public scoreSave(data: any) {
        return this.http.post<IMovieScore>('tv/admin/movie/score_save', data);
    }

    public scoreRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/movie/score_delete', {params: {id}});
    }

    public areaList() {
        return this.http.get<IData<IMovieArea>>('tv/admin/movie/area');
    }

    public areaSave(data: any) {
        return this.http.post<IMovieArea>('tv/admin/movie/area_save', data);
    }

    public areaRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/movie/area_delete', {params: {id}});
    }

    public seriesList(params: any) {
        return this.http.get<IPage<IMovieSeries>>('tv/admin/movie/series', {params});
    }

    public seriesSave(data: any) {
        return this.http.post<IMovieSeries>('tv/admin/movie/series_save', data);
    }

    public seriesRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/movie/series_delete', {params: {id}});
    }

    public movieFileList(params: any) {
        return this.http.get<IPage<IMovieFile>>('tv/admin/movie/file', {params});
    }

    public movieFileSave(data: any) {
        return this.http.post<IMovieFile>('tv/admin/movie/file_save', data);
    }

    public movieFileRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/movie/file_delete', {params: {id}});
    }

    public liveList(params: any) {
        return this.http.get<IPage<ILive>>('tv/admin/live', {params});
    }

    public liveSave(data: any) {
        return this.http.post<ILive>('tv/admin/live/save', data);
    }

    public liveRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/live/delete', {params: {id}});
    }

    public liveImport(data: any) {
        return this.http.post<IDataOne<boolean>>('tv/admin/live/import', data);
    }

    public musicList(params: any) {
        return this.http.get<IPage<IMusic>>('tv/admin/music', {params});
    }

    public music(id: any) {
        return this.http.get<IMusic>('tv/admin/music/detail', {params: {id}});
    }

    public musicSave(data: any) {
        return this.http.post<IMusic>('tv/admin/music/save', data);
    }

    public musicRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/music/delete', {params: {id}});
    }

    public musicUpload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('res/admin/music/upload', data);
    }

    public movieUpload(file: File) {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<IUploadResult>('res/admin/movie/upload', data);
    }


    public tagList(params: any) {
        return this.http.get<IPage<ITag>>('tv/admin/tag', {params});
    }

    public tagRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/tag/delete', {params: {id}});
    }

    public commentList(params: any) {
        return this.http.get<IPage<IComment>>('tv/admin/comment', {params});
    }

    public commentRemove(id: any) {
        return this.http.delete<IDataOne<boolean>>('tv/admin/comment/delete', {params: {id}});
    }

    public statistics() {
        return this.http.get<any>('tv/admin/statistics');
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
