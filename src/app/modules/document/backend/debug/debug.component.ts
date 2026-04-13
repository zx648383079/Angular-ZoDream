import { Component, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ArraySource, ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { eachObject, parseNumber } from '../../../../theme/utils';
import { IDocApi } from '../../model';
import { DocumentService } from '../document.service';
import { FieldTree, form } from '@angular/forms/signals';

interface IListOptionItem {
    checked: boolean;
    key: string;
    value: string;
    valueFile: File;
    type: string;
}

const CACHE_KEY = 'doc_aapi_debug';

interface ICacheRequest {
    method: string;
    url: string;
    headers: IListOptionItem[];
    bodyType: number;
    body: string;
    bodies: IListOptionItem[];
    rawType: string;
}

@Component({
    standalone: false,
    selector: 'app-doc-debug',
    templateUrl: './debug.component.html',
    styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly methodItems = ArraySource.fromValue('GET', 'POST', 'PUT', 'DELETE', 'OPTION');
    public readonly dataForm = form(signal({
        url: '',
        method: this.methodItems.items[0].value as string,
        headers: <IListOptionItem[]>[],
        bodyType: 0,
        rawType: '0',
        body: '',
        bodyFile: <File|null>null,
        bodies: <IListOptionItem[]>[]
    }));
    public readonly headerName = [
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
    public readonly requestIndex = signal(0);
    public readonly typeItems = ArraySource.fromOrder('none', 'form-data', 'x-www-form-urlencoded', 'raw', 'binary');
    public readonly rawItems = ArraySource.fromOrder('Text', 'JavaScript', 'JSON', 'HTML', 'XML');
    public readonly optionItems = ArraySource.fromOrder('Text', 'File');
    public readonly responseStatus = signal('');
    public readonly responseTime = signal(0);
    public readonly responseSize = signal(0);
    public readonly responseIndex = signal(0);
    public readonly responseBody = signal('');
    public readonly responseHeader = signal<IListOptionItem[]>([]);
    public readonly responseInfo = signal<IListOptionItem[]>([]);

    constructor() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.resetCache();
                return;
            }
            this.service.api(params.id).subscribe({
                next: res => {
                    this.applyApiData(res);
                }, 
                error: (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                }
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
                    return <IListOptionItem>{
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
                    return <IListOptionItem>{
                        checked: true,
                        key: i.name,
                        value: i.default_value,
                        type: '0',
                    };
                });
            }
            return {...v};
        });
        this.requestIndex.set(1);
        
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
            type: this.typeItems.items[data.bodyType],
            raw_type: this.rawItems.items[parseNumber(data.rawType)],
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
                this.responseStatus.set(data.headers.response[0]);
                this.responseTime.set(data.info.total_time);
                this.responseSize.set(data.info.download_content_length);
                this.responseBody.set(data.body);
                const rItems: IListOptionItem[] = [];
                for (const item of data.headers.response) {
                    if (item.indexOf(':') < 0) {
                        continue
                    }
                    const [key, value] = item.split(':');
                    rItems.push({
                        key: key.trim(),
                        value: value.trim()
                    } as any);
                }
                this.responseHeader.set(rItems);
                const iItems: IListOptionItem[] = [];
                eachObject(data.info, (v, k: string) => {
                    iItems.push({
                        key: k,
                        value: typeof v === 'object' ? JSON.stringify(v) : v, 
                    } as any);
                });
                this.responseInfo.set(iItems);
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
            } as any);
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
            } as any);
            return [...v];
        });
    }

    public tapRemoveBody(i: number) {
        this.dataForm.bodies().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }

    public uploadFile(event: any, item?: FieldTree<IListOptionItem, number>) {
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
            method: this.methodItems.items[0].value,
            headers: <IListOptionItem[]>[],
            bodyType: 0,
            rawType: '0',
            body: '',
            bodyFile: <File|null>null,
            bodies: <IListOptionItem[]>[]
        });
        this.requestIndex.set(0);
        this.responseStatus.set('');
        this.responseTime.set(0);
        this.responseSize.set(0);
        this.responseIndex.set(0);
        this.responseInfo.set([]);
        this.responseHeader.set([]);
        this.responseBody.set('');
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
