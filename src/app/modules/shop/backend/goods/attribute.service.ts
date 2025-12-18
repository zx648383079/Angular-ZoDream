import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IData, IDataOne, IPage } from '../../../../theme/models/page';
import { IAttribute, IAttributeGroup } from '../../model';

@Injectable()
export class AttributeService {
    private readonly http = inject(HttpClient);


    public attrList(params: any) {
        return this.http.get < IPage < IAttribute >> ('shop/admin/attribute', {
            params,
        });
    }

    public attr(id: any) {
        return this.http.get < IAttribute > ('shop/admin/attribute/detail', {
            params: {
                id
            },
        });
    }

    public attrSave(data: any) {
        return this.http.post < IAttribute > ('shop/admin/attribute/save', data);
    }

    public attrRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('shop/admin/attribute/delete', {
            params: {
                id
            }
        });
    }

    public groupList(params: any) {
        return this.http.get < IPage < IAttributeGroup >> ('shop/admin/attribute/group', {
            params,
        });
    }

    public group(id: any) {
        return this.http.get < IAttributeGroup > ('shop/admin/attribute/detail_group', {
            params: {
                id
            },
        });
    }

    public groupSave(data: any) {
        return this.http.post < IAttributeGroup > ('shop/admin/attribute/save_group', data);
    }

    public groupRemove(id: any) {
        return this.http.delete < IDataOne < true >> ('shop/admin/attribute/delete_group', {
            params: {
                id
            }
        });
    }

    public groupAll() {
        return this.http.get < IData < IAttributeGroup >> ('shop/admin/attribute/group_all');
    }
}
