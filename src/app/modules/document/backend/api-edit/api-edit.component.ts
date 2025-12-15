import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { emptyValidate } from '../../../../theme/validators';
import { IApiField, IDocApi, IDocTreeItem, IProject, IProjectVersion } from '../../model';
import { DocumentService } from '../document.service';
import { treeRemoveId } from '../../shared';

@Component({
    standalone: false,
    selector: 'app-api-edit',
    templateUrl: './api-edit.component.html',
    styleUrls: ['./api-edit.component.scss']
})
export class ApiEditComponent implements OnInit {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        name: '',
        method: 'GET',
        uri: '',
        description: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: IDocApi;
    public project: IProject;
    public version = 0;
    public catalog: IDocApi[] = [];
    public versionItems: IProjectVersion[] = [];
    public readonly editForm = form(signal<any>({}));
    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.project) {
                return;
            }
            this.version = params.version ? parseInt(params.version, 10) : 0;
            this.service.project(params.project).subscribe(res => {
                this.project = res;
                this.loadCatalog(res.id, params.id)
            });

        });
    }

    private loadCatalog(project: any, id: any) {
        this.service.catalogAll(project, this.version).subscribe(res => {
            this.catalog = res.data;
            this.initData(id);
        });
    }

    // private refreshCatalog() {
    //     this.service.catalogAll(this.project.id, this.version).subscribe(res => {
    //         this.catalog = res.data;
    //     });
    // }

    private initData(id: any) {
        this.refreshVersion();
    }

    private refreshVersion() {
        this.service.versionAll(this.project.id).subscribe(res => {
            this.versionItems = res.data;
        });
    }

    public onVersionChange() {
        this.service.catalogAll(this.project.id, this.version).subscribe(res => {
            this.catalog = res.data;
        });
    }

    public onCreate(data: IDocTreeItem) {
        this.data = {
            ...data,
            project_id: this.project.id,
            version_id: this.version,
            method: 'GET',
            description: '',
            uri: '',
            header: [],
            request: [],
            response: [],
        } as any;
        this.dataModel.set({
                        id: res.id,
            name: '',
            method: 'GET',
            description: '',
            uri: '',
        });
    }

    public tapEdit(item: IDocTreeItem) {
        this.service.api(item.id).subscribe(res => {
            this.data = res;
            this.dataModel.set({
                        id: res.id,
                name: res.name,
                method: res.method,
                description: res.description,
                uri: res.uri,
            });
            document.documentElement.scrollTop = 0;
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.form.valid) {
            return;
        }
        const data = Object.assign({}, this.data, this.form.value);
        if (data.type < 1 && emptyValidate(data.uri)) {
            this.toastrService.warning('请输入接口路径');
            return;
        }
        e?.enter();
        this.service.apiSave(data).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.data = res;
                this.appendData(res);
            },
            error: (err: IErrorResult) => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

    private appendData(data: IDocApi) {
        const findParent = (id: number, items: IDocApi[]) => {
            if (id < 1) {
                return items;
            }
            for (const item of items) {
                if (item.id === id) {
                    if (!item.children) {
                        item.children = [];
                    }
                    return item.children;
                }
                if (!item.children || item.children.length < 1) {
                    continue;
                }
                const kids = findParent(id, item.children);
                if (kids) {
                    return kids;
                }
            }
        };
        const children = findParent(data.parent_id, this.catalog);
        for (const item of children) {
            if (item.id === data.id) {
                item.name = data.name;
                item.type = data.type;
                return;
            }
        }
        children.push(data);
    }

    public tapRemove(item: IDocApi) {
        this.toastrService.confirm('确定删除“' + item.name + '”文档？', () => {
            this.service.apiRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.catalog = treeRemoveId(this.catalog, item.id);
            });
        });
    }

    public openVersion(modal: DialogBoxComponent) {
        this.editForm = {
            name: ''
        };
        modal.open(() => {
            this.service.versionNew(this.project.id, this.version, this.editForm.name).subscribe(_ => {
                this.toastrService.success('创建版本成功');
                this.refreshVersion();
            });
        }, () => {
            return !emptyValidate(this.editForm.name);
        });
    }

    public tapParse(modal: DialogBoxComponent, kind: number) {
        this.editForm = {
            content: ''
        };
        modal.open(() => {
            this.service.apiParse(this.editForm.content, kind).subscribe(res => {
                if (kind === 3) {
                    this.data.header.push(...res.data);
                    return;
                }
                if (kind === 1) {
                    this.data.request.push(...res.data);
                    return;
                }
                this.data.response.push(...res.data);
            });
        }, () => {
            return !emptyValidate(this.editForm.content);
        })
    }

    public tapRemoveItem(i: number, kind: number, parent?: IApiField) {
        if (parent) {
            parent.children.splice(i, 1);
            return;
        }
        if (kind === 3) {
            this.data.header.splice(i, 1);
            return;
        }
        if (kind === 1) {
            this.data.request.splice(i, 1);
            return;
        }
        this.data.response.splice(i, 1);
    }

    public tapAddItem(kind: number, parent?: IApiField) {
        let item: any;
        if (kind === 3) {
            item = {
                name: '',
                title: '',
                remark: ''
            };
        } else if (kind === 1) {
            item = {
                name: '',
                title: '',
                type: 'string',
                is_required: 0,
                default_value: '',
                remark: ''
            };
        } else {
            item = {
                name: '',
                title: '',
                type: 'string',
                mock: '',
                remark: ''
            };
        }
        if (parent) {
            if (!parent.children) {
                parent.children = [item];
                return;
            }
            parent.children.push(item);
            return;
        }
        if (kind === 1) {
            this.data.request.push(item);
            return;
        }
        if (kind === 2) {
            this.data.response.push(item);
            return;
        }
        this.data.header.push(item);
    }

}
