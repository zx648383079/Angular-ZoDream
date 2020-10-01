import {
    HttpClient
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import { of } from 'rxjs';
import {
    IData,
    IDataOne,
    IPage
} from '../../theme/models/page';
import {
    ILog,
    ISignature, ITemplate
} from '../../theme/models/sms';

@Injectable({
    providedIn: 'root'
})
export class SmsService {

    constructor(private http: HttpClient) {}

    public logList(params: any) {
        return this.http.get < IPage < ILog >> ('sms/admin/log', {
            params,
        });
    }

    public logRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('sms/admin/log/delete', {
            params: {
                id
            }
        });
    }

    public signatureList(params: any) {
        return this.http.get < IPage < ISignature >> ('sms/admin/signature', {
            params,
        });
    }

    public signature(id: any) {
        return this.http.get < ISignature > ('sms/admin/signature/detail', {
            params: {
                id
            },
        });
    }

    public signatureSave(data: any) {
        return this.http.post < ISignature > ('sms/admin/signature/save', data);
    }

    public signatureDefault(id: any) {
        return this.http.post < IDataOne < true > > ('sms/admin/signature/default', {
            id
        });
    }

    public signatureRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('sms/admin/signature/delete', {
            params: {
                id
            }
        });
    }

    public signatureAll() {
        return this.http.get < IData < ISignature >> ('sms/admin/signature/all');
    }

    public templateList(params: any) {
        return this.http.get < IPage < ITemplate >> ('sms/admin/template', {
            params,
        });
    }

    public template(id: any) {
        return this.http.get < ITemplate > ('sms/admin/template/detail', {
            params: {
                id
            },
        });
    }

    public templateSave(data: any) {
        return this.http.post < ITemplate > ('sms/admin/template/save', data);
    }

    public templateRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('sms/admin/template/delete', {
            params: {
                id
            }
        });
    }

    public typeItems() {
        return of([
            {
                name: '登录验证码',
                value: 1,
            }
        ]);
    }
}
