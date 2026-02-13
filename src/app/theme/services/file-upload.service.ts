import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { IUploadFile, IUploadResult } from '../models/open';
import { IPage } from '../models/page';
import { Observable, Subject } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { ICustomFormData, IUploadServer, UploadFile } from './uploader';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    static guid = 0;

    private readonly http = inject(HttpClient);

    public uniqueId(): number {
        if (FileUploadService.guid > 100000) {
            FileUploadService.guid = 0;
        }
        return ++ FileUploadService.guid;
    }

    public uniqueGuid(): string {
        return 'zre_file_' + this.uniqueId();
    }

    /**
     * 上传文件
     * @param file 文件
     */
    public uploadFile(file: File, progress$?: Subject<HttpProgressEvent>) {
        return this.upload<IUploadResult>('open/file', file, progress$);
    }

    public uploadFiles(files: FormData | FileList, progress$?: Subject<HttpProgressEvent>) {
        return this.uploadAny('open/file', files, progress$);
    }

    /**
     * 上传图片
     * @param file 文件
     */
    public uploadImage(file: File, progress$?: Subject<HttpProgressEvent>) {
        return this.upload<IUploadResult>('open/file/image', file, progress$);
    }

    public uploadImages(files: FormData | FileList, progress$?: Subject<HttpProgressEvent>) {
        return this.uploadAny('open/file/image', files, progress$);
    }

    /**
     * 上传视频
     * @param file 文件
     */
    public uploadVideo(file: File, progress$?: Subject<HttpProgressEvent>) {
        return this.upload<IUploadResult>('open/file/video', file, progress$);
    }

    /**
     * 上传音频
     * @param file 文件
     */
    public uploadAudio(file: File, progress$?: Subject<HttpProgressEvent>) {
        const form = new FormData();
        form.append('file', file);
        return this.upload<IUploadResult>('open/file/audio', file, progress$);
    }

    /**
     * 上传base64编码的图片
     * @param file 文件
     */
    public uploadBase64(file: string, progress$?: Subject<HttpProgressEvent>): Observable<IUploadResult> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post('open/file/base64', form, {
            observe: 'events',
            reportProgress: !!progress$
        }).pipe(map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Response:
                        return event.body;
                    case HttpEventType.UploadProgress:
                        progress$?.next(event);
                        break;
                }
                return false;
            }),
            last()
        );
    }

    /**
     * 获取图片列表
     * @param params 格式 {page: number, per_page: number}
     */
    public images(params: any) {
        return this.http.get<IPage<IUploadFile>>('open/file/images', {
            params
        });
    }

    /**
     * 获取文件列表包括视频、图片
     * @param params 格式 {page: number, per_page: number}
     */
    public files(params: any) {
        return this.http.get<IPage<IUploadFile>>('open/file/files', {
            params
        });
    }

    /**
     * 获取本地预览图
     * @param file 路径
     */
    public preview(file: File): Observable<string> {
        const reader = new FileReader();
        const subject = new Subject<string>();
        reader.onload = () => {
            subject.next(reader.result as string);
        };
        reader.readAsDataURL(file);
        return subject;
    }

    /**
     * upload
     */
    public upload<T>(
        url: string,
        image: File|FormData,
        progress$?: Subject<HttpProgressEvent>,
        headers?: Headers | { [name: string]: any },
        partName: string = 'file',
        customFormData?: { [name: string]: any },
        withCredentials?: boolean,): Observable<T> {
        if (!url || url === '') {
            throw new Error('Url is not set! Please set it before doing queries');
        }

        const options: any = {
            observe: 'events',
            reportProgress: !!progress$
        };

        if (withCredentials) {
            options.withCredentials = withCredentials;
        }

        if (headers) {
            options.headers = new Headers(headers);
        }
        let form: FormData;
        if (image instanceof FormData) {
            form = image;
        } else {
            form = new FormData();
            form.append(partName, image);
        }
        for (const key in customFormData) {
            if (customFormData.hasOwnProperty(key)) {
                form.append(key, customFormData[key]);
            }
        }
        return this.http.post<T>(url, form, options).pipe(map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Response:
                        return event.body;
                    case HttpEventType.UploadProgress:
                        progress$?.next(event);
                        break;
                }
                return false;
            }),
            last()
        );
    }

    public uploadAny(url: string, files: FormData|FileList, progress$?: Subject<HttpProgressEvent>): Observable<IUploadResult[]> {
        let form: FormData;
        if (files instanceof FormData) {
            form = files;
        } else {
            form = new FormData();
            for (let i = 0; i < files.length; i++) {
                form.append('file[]', files[i], files[i].name);
            }
        }
        return this.http.post<any>(url, form, {
            observe: 'events',
            reportProgress: !!progress$
        }).pipe(map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Response:
                        const res = event.body;
                        return res.data && typeof res.data === 'object' && res.data instanceof Array ? res.data : [res];
                    case HttpEventType.UploadProgress:
                        progress$?.next(event);
                        break;
                }
                return false;
            }),
            last()
        );
    }

    /**
     * 切片上传
     * @param url 
     * @param file 
     * @param customFormData 
     * @param fileMd5 
     * @returns 
     */
    public uploadChunk<T = IUploadResult>(url: string|IUploadServer, file: File, customFormData: ICustomFormData = {}, fileMd5 = '') {
        return new UploadFile<T>(url, file, customFormData, fileMd5);
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

    /**
     * 导出文件
     * @param url 
     * @param data 
     * @param fileName 备选，以 headers 获取的为首选项  
     * @param fileType 可不填，自动获取
     */
    public export(url: string, data: any, fileName?: string, fileType?: any, progress$?: Subject<HttpProgressEvent>): Observable<boolean> {
        return this.http.request('post', url, {
            body: data,
            observe: 'events',
            responseType: 'blob',
            reportProgress: !!progress$
        }).pipe(map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Response:
                        this.downFile(event, fileName, fileType);
                        return true;
                    case HttpEventType.DownloadProgress:
                        progress$?.next(event);
                        break;
                }
                return false;
            }),
            last(),
        );
    }

    private parseFileName(header: string, def?: string): string {
        if (!header) {
            return def;
        }
        const name = header.split(';')[1].trim().split('=')[1];
        return decodeURI(name.replace(/"/g, ''));
    }
}
