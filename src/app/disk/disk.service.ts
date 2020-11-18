import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { mockDisks, mockShare, mockMyShare } from '../theme/mock/disk';
import { IDisk, IShare, IShareFile } from '../theme/models/disk';
import { IPage } from '../theme/models/page';
import { mockPage } from '../theme/mock/page';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DiskService {

    constructor(
        private http: HttpClient,
    ) { }

    public getCatalog(params: any): Observable<IDisk[]> {
        return of(mockDisks);
    }

    public getShareList(param: any): Observable<IPage<IShare>> {
        return of(mockPage(mockShare));
    }

    public getMyShare(param: any): Observable<IPage<IShare>> {
        return of(mockPage(mockShare));
    }

    public getTrash(param: any): Observable<IPage<IDisk>> {
        return of(mockPage(mockDisks));
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
