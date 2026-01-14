import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { eachObject } from '../../../../theme/utils';
import { IDocApi } from '../../model';
import { DocumentService } from '../document.service';
import { FieldTree, form } from '@angular/forms/signals';

interface IOptionItem {
    checked?: boolean;
    key: string;
    value?: string;
    valueFile?: File;
    type?: string;
}

const CACHE_KEY = 'doc_aapi_debug';

interface ICacheRequest {
    method: string;
    url: string;
    headers: IOptionItem[];
    bodyType: number;
    body: string;
    bodies: IOptionItem[];
    rawType: string;
}

@Component({
    standalone: false,
    selector: 'app-doc-debug',
    templateUrl: './debug.component.html',
    styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];
    public readonly dataForm = form(signal({
        url: '',
        method: this.methodItems[0],
        headers: <IOptionItem[]>[],
        bodyType: 0,
        rawType: '0',
        body: '',
        bodyFile: <File>null,
        bodies: <IOptionItem[]>[]
    }));
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
    public typeItems = ['none', 'form-data', 'x-www-form-urlencoded', 'raw', 'binary'];
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
        this.dataForm().value.update(v => {
            v.method = res.method;
            v.url = res.uri;
            if (res.header && res.header.length > 0)
            {
                v.headers = res.header.map(i => {
                    return <IOptionItem>{
                        checked: true,
                        key: i.name,
                        value: i.default_value,
                    };
                });
            }
            if (res.request && res.request.length > 0) {
                v.bodyType = 2;
                v.rawType = '2';
                v.bodies = res.request.map(i => {
                    return <IOptionItem>{
                        checked: true,
                        key: i.name,
                        value: i.default_value,
                        type: '0',
                    };
                });
            }
            return {...v};
        });
        this.requestIndex = 1;
        
    }

    public toggle(item: WritableSignal<boolean>) {
        item.update(v => !v);
    }

    public tapSend(e?: ButtonEvent) {
        e?.enter();
        const data = this.dataForm().value();
        this.service.apiDebug({
            url: data.url,
            method: data.method,
            type: this.typeItems[data.bodyType],
            raw_type: this.rawItems[data.rawType],
            header: data.headers.filter(i => i.checked),
            body: data.bodyType == 3 ? data.body : data.bodyType == 4 ? data.bodyFile 
            : data.bodies.filter(i => i.checked).map(i => {
                if (i.type == '1') {
                    return {...i, value: i.valueFile, valueFile: undefined};
                }
                return i;
            }),
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
        this.dataForm.headers().value.update(v => {
            v.push({
                checked: false,
                key: '',
                value: ''
            });
            return [...v];
        });
    }

    public tapRemoveHeader(i: number) {
        this.dataForm.headers().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public onTypeChange() {
    }

    public tapAddBody() {
        this.dataForm.bodies().value.update(v => {
            v.push({
                checked: false,
                key: '',
                value: '',
                type: '0',
            });
            return [...v];
        });
    }

    public tapRemoveBody(i: number) {
        this.dataForm.bodies().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public uploadFile(event: any, item?: FieldTree<IOptionItem, number>) {
        const files = event.target.files as FileList;
        if (item) {
            item().value.update(v => {
                v.valueFile = files[0];
                v.type = '1';
                return {...v};
            });
            return;
        }
        this.dataForm.bodyFile().value.set(files[0]);
    }

    public tapReset() {
        this.dataForm().value.set({
            url: '',
            method: this.methodItems[0],
            headers: <IOptionItem[]>[],
            bodyType: 0,
            rawType: '0',
            body: '',
            bodyFile: <File>null,
            bodies: <IOptionItem[]>[]
        });
        this.requestIndex = 0;
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
        this.dataForm().value.update(v => {
            v.method = data.method;
            v.url = data.url;
            v.headers = data.headers;
            v.bodyType = data.bodyType;
            v.rawType = data.rawType as any;
            v.body = data.body;
            v.bodies = data.bodies;
            return v;
        });
    }

    private setCache() {
        localStorage.setItem(CACHE_KEY, JSON.stringify(this.dataForm().value()));
    }

}
