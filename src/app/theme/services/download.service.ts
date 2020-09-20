import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DownloadService {
    constructor(private http: HttpClient) { }

    /**
     * Blob请求
     */
    requestBlob(url: string, data?: any): Observable<any> {
        return this.http.request('post', url, {
            body: data,
            observe: 'response',
            responseType: 'blob',
        });
    }
    /**
     * Blob文件转换下载
     */
    downFile(result: any, fileName: string, fileType?: string) {
        const data = result.body;
        const blob = new Blob([data], {
                type: fileType || data.type,
            });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', fileName);
        a.click();
        URL.revokeObjectURL(objectUrl);
    }

    export(data: any, fileName: string, fileType?: any) {
        const url = '';
        this.requestBlob(url, data).subscribe(result => {
            this.downFile(result, fileName,
                fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        });
    }

}
