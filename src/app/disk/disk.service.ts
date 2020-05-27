import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { mockDisks } from '../theme/mock/disk';
import { IDisk } from '../theme/models/disk';

@Injectable()
export class DiskService {

    constructor() { }

    public getCatalog(parent_id: number): Observable<IDisk[]> {
        return of(mockDisks);
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
