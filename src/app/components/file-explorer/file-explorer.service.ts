import { Injectable, inject } from '@angular/core';
import { IFileItem, IFileProvider, IFileQueries } from './model';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { IData, IPage } from '../../theme/models/page';

@Injectable()
export class FileExplorerService implements IFileProvider {
    private http = inject(HttpClient);


    public driveList(): Observable<IFileItem[]> {
        return from([
            [
                <IFileItem>{
                    name: 'C: System',
                    path: 'c:',
                    isFolder: true,
                }
            ]
        ]);
    }

    public searchFile(params: IFileQueries): Observable<IPage<IFileItem>|IData<IFileItem>> {
        return from([
            {
                data: [
                    <IFileItem>{name: 'Workspace', path: '/', isFolder: true},
                    <IFileItem>{name: 'undefine.txt', path: '/', isFolder: params.filter === 'folder'},
                    <IFileItem>{name: 'undefine.png', path: '/', thumb: 'assets/images/favicon.png', isFolder: params.filter === 'folder'},
                ]
            }
        ]);
    }
}
