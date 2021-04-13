import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DownloadService {
    constructor(private http: HttpClient) { }

    /**
     * Blob请求
     */
    public requestBlob(url: string, data?: any): Observable<HttpResponse<Blob>> {
        return this.http.request('post', url, {
            body: data,
            observe: 'response',
            responseType: 'blob',
        });
    }
    
    /**
     * Blob文件转换下载
     */
    public downFile(result: HttpResponse<Blob>, fileName?: string, fileType?: string) {
        fileName = this.parseFileName(result.headers.get('Content-Disposition'), fileName);
        if (!fileName) {
            console.log('fileName error');
            return;
        }
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

    public export(url: string, data: any, fileName?: string, fileType?: any) {
        this.requestBlob(url, data).subscribe((res: HttpResponse<Blob>) => {
            this.downFile(res, fileName, fileType);
        });
    }

    private parseFileName(header: string, def?: string): string {
        if (!header) {
            return def;
        }
        const name = header.split(';')[1].trim().split('=')[1];
        return decodeURI(name.replace(/"/g, ''));
    }

}
