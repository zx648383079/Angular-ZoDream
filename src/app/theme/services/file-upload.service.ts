import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { IUploadFile, IUploadResult } from '../models/open';
import { IPage } from '../models/page';
import { Observable, Subject } from 'rxjs';
import { last, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    static guid = 0;

    constructor(private http: HttpClient) {}

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
    public uploadFile(file: File) {
        return this.upload<IUploadResult>('open/file', file);
    }

    /**
     * 上传图片
     * @param file 文件
     */
    public uploadImage(file: File) {
        return this.upload<IUploadResult>('open/file/image', file);
    }

    public uploadImages(files: FormData | FileList): Observable<IUploadResult[]> {
        let form: FormData;
        if (files instanceof FormData) {
            form = files;
        } else {
            form = new FormData();
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < files.length; i++) {
                form.append('file[]', files[i], files[i].name);
            }
        }
        return this.http.post<any>('open/file/image', form).pipe(map(res => {
            if (res.data && typeof res.data === 'object' && res.data instanceof Array) {
                return res.data;
            }
            return [res];
        }));
    }

    /**
     * 上传视频
     * @param file 文件
     */
    public uploadVideo(file: File) {
        return this.upload<IUploadResult>('open/file/video', file);
    }

    /**
     * 上传音频
     * @param file 文件
     */
    public uploadAudio(file: File) {
        const form = new FormData();
        form.append('file', file);
        return this.upload<IUploadResult>('open/file/audio', file);
    }

    /**
     * 上传base64编码的图片
     * @param file 文件
     */
    public uploadBase64(file: string) {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<IUploadResult>('open/file/base64', form);
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
    public preview(file: File): Promise<string> {
        const reader = new FileReader();
        return new Promise(resolve => {
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * upload
     */
    public upload<T>(
        url: string,
        image: File,
        headers?: Headers | { [name: string]: any },
        partName: string = 'file',
        customFormData?: { [name: string]: any },
        withCredentials?: boolean): Observable<T> {
        if (!url || url === '') {
            throw new Error('Url is not set! Please set it before doing queries');
        }

        const options: any = {};

        if (withCredentials) {
            options.withCredentials = withCredentials;
        }

        if (headers) {
            options.headers = new Headers(headers);
        }

        // add custom form data
        const formData = new FormData();
        for (const key in customFormData) {
            if (customFormData.hasOwnProperty(key)) {
                formData.append(key, customFormData[key]);
            }
        }
        formData.append(partName, image);
        return this.http.post<T>(url, formData, options).pipe(map((res: any) => res));
    }

    /**
     * 上传文件显示进度条
     * @param url 
     * @param file 
     * @param onProgress 
     * @returns 
     */
    public uploadWithProgress<T = any>(url: string, file: File|FormData, onProgress: (loaded: number, total: number) => void): Observable<T> {
        const req = new HttpRequest('POST', url, file, {
            reportProgress: true
        });
        return this.http.request(req).pipe(
            map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Response:
                        return event.body;
                    case HttpEventType.UploadProgress:
                        onProgress(event.loaded, event.total ?? 0);
                    default:
                        return 'uploading';
                }
            }),
            last(),
        );
    }

    /**
     * 切片上传
     * @param url 
     * @param file 
     * @param onProgress 
     * @param partName 
     * @param customFormData 
     * @param chunkSize 
     * @returns 
     */
    public uploadChunk(url: string, file: File, onProgress: (loaded: number, total: number) => void, 
        partName: string = 'file',
        customFormData?: { [name: string]: any }, chunkSize = 1024 * 1024) {
        const finish$ = new Subject<void>();
        let loaded = 0;
        const total = file.size;
        const uploadFn = (start: number) => {
            if (start >= total) {
                finish$.next();
                return;
            }
            const end = Math.min(start + chunkSize, total);
            let form = new FormData();
            for (const key in customFormData) {
                if (customFormData.hasOwnProperty(key)) {
                    form.append(key, customFormData[key]);
                }
            }
            form.append(partName, file.slice(start, end));
            this.uploadWithProgress(url, form, l => {
                loaded = start + l;
                onProgress(loaded, total);
            }).subscribe({
                next: _ => {
                    uploadFn(end);
                },
                error: err => {
                    finish$.error(err);
                }
            });
        };
        uploadFn(0);
        return finish$;
    }
}
