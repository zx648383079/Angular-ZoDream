import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDisk, IShare } from '../theme/models/disk';
import { IDataOne, IPage } from '../theme/models/page';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DiskService {

    constructor(
        private http: HttpClient,
    ) { }

    public getCatalog(params: any) {
        return this.http.get<IPage<IDisk>>('disk', {params});
    }

    public shareList(params: any) {
        return this.http.get<IPage<IShare>>('disk/share', {params});
    }

    public myShare(params: any) {
        return this.http.get<IPage<IShare>>('disk/share/my', {params});
    }

    public trashList(params: any) {
        return this.http.get<IPage<IDisk>>('disk/trash', {params});
    }

    public allowUrl(url: string): Observable<IDataOne<string>>;
    public allowUrl(url: string[]): Observable<IDataOne<string[]>>;
    public allowUrl(url: string|string[]) {
        return this.http.post<IDataOne<string|string[]>>('disk/home/allow', {url});
    }

    public getIconByExt(ext?: string): string {
        if (!ext) {
            return 'icon-folder-o';
        }
        const type = this.getTypeByExt(ext);
        if (type === 'image') {
            return 'icon-file-image-o';
        }
        if (type === 'music') {
            return 'icon-music';
        }
        if (type === 'movie') {
            return 'icon-file-movie-o';
        }
        return 'icon-file-o';
    }

    public getTypeByExt(ext?: string): string {
        if (!ext) {
            return '';
        }
        if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'].indexOf(ext) >= 0) {
            return 'image';
        }
        if (['mp3', 'flac', 'ape', 'wav'].indexOf(ext) >= 0) {
            return 'music';
        }
        if (['mp4', 'mkv', '3gp', 'avi'].indexOf(ext) >= 0) {
            return 'movie';
        }
        return '';
    }
}
