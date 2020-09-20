import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class UploadService {
    constructor(private httpClient: HttpClient) { }

    /**
     * upload
     */
    public upload(
        url: string,
        image: File,
        headers?: Headers | { [name: string]: any },
        partName: string = 'file',
        customFormData?: { [name: string]: any },
        withCredentials?: boolean): Observable<any> {
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
        return this.httpClient.post<any>(url, formData, options).pipe(map((res: any) => res.data));
    }
}
