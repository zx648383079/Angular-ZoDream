import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { eachObject } from '../../../../theme/utils';
import { IDocApi } from '../../model';
import { DocumentService } from '../document.service';

interface IOptionItem {
    checked?: boolean;
    key: string;
    value: any;
    type?: number;
}

const CACHE_KEY = 'doc_aapi_debug';

interface ICacheRequest {
    method: string;
    url: string;
    headers: IOptionItem[];
    bodyType: number;
    body: any;
    rawType: number;
}

@Component({
    standalone: false,
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
    private service = inject(DocumentService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];
    public method = 'GET';
    public url = '';
    public headerItems: IOptionItem[] = [];
    public headerName = [
        'Host',
        'User-Agent',
        'Accept',
        'Accept-Language',
        'Accept-Encoding',
        'If-Modified-Since',
        'Cookie',
        'Referer',
        'Authorization',
    ];
    public requestIndex = 0;
    public bodyType = 0;
    public body: any;
    public typeItems = ['none', 'form-data', 'x-www-form-urlencoded', 'raw', 'binary'];
    public rawType = 0;
    public rawItems = ['Text', 'JavaScript', 'JSON', 'HTML', 'XML'];
    public optionItems = ['Text', 'File'];
    public responseStatus = '';
    public responseTime = 0;
    public responseSize = 0;
    public responseIndex = 0;
    public responseBody = '';
    public responseHeader: IOptionItem[] = [];
    public responseInfo: IOptionItem[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.resetCache();
                return;
            }
            this.service.api(params.id).subscribe(res => {
                this.applyApiData(res);
            }, (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            });
        });
    }

    private applyApiData(res: IDocApi) {
        this.method = res.method;
        this.url = res.uri;
        this.requestIndex = 1;
        if (res.header && res.header.length > 0) {
            this.headerItems = res.header.map(i => {
                return {
                    checked: true,
                    key: i.name,
                    value: i.default_value,
                };
            });
        }
        if (res.request && res.request.length > 0) {
            this.bodyType = 2;
            this.rawType = 2;
            this.body = res.request.map(i => {
                return {
                    checked: true,
                    key: i.name,
                    value: i.default_value,
                    type: 0,
                };
            });
        }
    }

    public tapSend(e?: ButtonEvent) {
        e?.enter();
        this.service.apiDebug({
            url: this.url,
            method: this.method,
            type: this.typeItems[this.bodyType],
            raw_type: this.rawItems[this.rawType],
            header: this.headerItems.filter(i => i.checked),
            body: this.body instanceof Array ? this.body.filter(i => i.checked) : this.body,
        }).subscribe({
            next: res => {
                e?.reset();
                const data = res.data;
                this.responseStatus = data.headers.response[0];
                this.responseTime = data.info.total_time;
                this.responseSize = data.info.download_content_length;
                this.responseBody = data.body;
                this.responseHeader = [];
                for (const item of data.headers.response) {
                    if (item.indexOf(':') < 0) {
                        continue
                    }
                    const [key, value] = item.split(':');
                    this.responseHeader.push({
                        key: key.trim(),
                        value: value.trim()
                    });
                }
                this.responseInfo = [];
                eachObject(data.info, (v, k: string) => {
                    this.responseInfo.push({
                        key: k,
                        value: typeof v === 'object' ? JSON.stringify(v) : v, 
                    });
                });
            },
            error: (err: IErrorResult) => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
        this.setCache();
    }

    public tapAddHeader() {
        this.headerItems.push({
            checked: false,
            key: '',
            value: ''
        });
    }

    public tapRemoveHeader(i: number) {
        this.headerItems.splice(i, 1);
    }

    public onTypeChange() {
        this.body = this.bodyType > 0 && this.bodyType < 3 ? [] : '';
    }

    public tapAddBody() {
        if (!(this.body instanceof Array)) {
            this.body = [];
        }
        this.body.push({
            checked: false,
            key: '',
            value: '',
            type: 0,
        });
    }

    public tapRemoveBody(i: number) {
        if (!(this.body instanceof Array)) {
            this.body = [];
            return;
        }
        this.body.splice(i, 1);
    }

    public uploadFile(event: any, item?: IOptionItem) {
        const files = event.target.files as FileList;
        if (item) {
            item.value = files[0];
            item.type = 1;
            return;
        }
        this.body = files[0];
    }

    public tapReset() {
        this.url = '';
        this.method = 'GET';
        this.headerItems = [];
        this.requestIndex = 0;
        this.bodyType = 0;
        this.body = null;
        this.rawType = 0;
        this.responseStatus = '';
        this.responseTime = 0;
        this.responseSize = 0;
        this.responseIndex = 0;
        this.responseInfo = [];
        this.responseHeader = [];
        this.responseBody = '';
        localStorage.removeItem(CACHE_KEY);
    }

    private resetCache() {
        const str = localStorage.getItem(CACHE_KEY);
        if (!str) {
            return;
        }
        const data: ICacheRequest = JSON.parse(str);
        if (!data) {
            return;
        }
        this.method = data.method;
        this.url = data.url;
        this.headerItems = data.headers;
        this.bodyType = data.bodyType;
        this.body = data.body;
        this.rawType = data.rawType;
    }

    private setCache() {
        const data: ICacheRequest = {
            method: this.method,
            url: this.url,
            headers: this.headerItems,
            body: this.body,
            bodyType: this.bodyType,
            rawType: this.bodyType
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }

}
