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
} from './model';
import { IFormInput } from '../../components/form';

@Injectable()
export class MessageServiceService {

    constructor(private http: HttpClient) {}

    public logList(params: any) {
        return this.http.get < IPage < ILog >> ('ms/admin/log', {
            params,
        });
    }

    public logRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('ms/admin/log/delete', {
            params: {
                id
            }
        });
    }

    public signatureList(params: any) {
        return this.http.get < IPage < ISignature >> ('ms/admin/signature', {
            params,
        });
    }

    public signature(id: any) {
        return this.http.get < ISignature > ('ms/admin/signature/detail', {
            params: {
                id
            },
        });
    }

    public signatureSave(data: any) {
        return this.http.post < ISignature > ('ms/admin/signature/save', data);
    }

    public signatureDefault(id: any) {
        return this.http.post < IDataOne < true > > ('ms/admin/signature/default', {
            id
        });
    }

    public signatureRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('ms/admin/signature/delete', {
            params: {
                id
            }
        });
    }

    public signatureAll() {
        return this.http.get < IData < ISignature >> ('ms/admin/signature/all');
    }

    public templateList(params: any) {
        return this.http.get < IPage < ITemplate >> ('ms/admin/template', {
            params,
        });
    }

    public template(id: any) {
        return this.http.get < ITemplate > ('ms/admin/template/detail', {
            params: {
                id
            },
        });
    }

    public templateSave(data: any) {
        return this.http.post < ITemplate > ('ms/admin/template/save', data);
    }

    public templateRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('ms/admin/template/delete', {
            params: {
                id
            }
        });
    }

    public option(isMail: boolean) {
        return this.http.get<IData<IFormInput>>('ms/admin/option/' + (isMail ? 'mail' : 'sms'));
    }

    public optionSave(data: any, isMail: boolean) {
        return this.http.post<IDataOne<true>>('ms/admin/option/' + (isMail ? 'mail' : 'sms') + '_save', data);
    }


    public statistics() {
        return this.http.get<any>('ms/admin/statistics');
    }

    public typeItems() {
        return of([
            {
                name: 'TEXT',
                value: 1,
            },
            {
                name: 'HTML',
                value: 5,
            }
        ]);
    }
}
