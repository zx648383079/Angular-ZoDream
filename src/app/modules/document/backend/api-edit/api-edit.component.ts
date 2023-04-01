import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuComponent } from '../../../../components/context-menu';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { emptyValidate } from '../../../../theme/validators';
import { IApiField, IDocApi, IProject, IProjectVersion } from '../../model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-api-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss']
})
export class ApiEditComponent implements OnInit {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;

    public form = this.fb.group({
        name: ['', Validators.required],
        method: ['GET'],
        uri: [''],
        description: [''],
    });

    public data: IDocApi;
    public project: IProject;
    public version = 0;
    public catalog: IDocApi[] = [];
    public versionItems: IProjectVersion[] = [];
    public editData: any = {};
    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];
    


    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

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

    public tapContextMenu(e: MouseEvent, parent?: IDocApi) {
        this.contextMenu.show(e, [
            {
                name: '新建文件夹',
                icon: 'icon-folder-o',
            },
            {
                name: '新建文件',
                icon: 'icon-file-text-o'
            },
            {
                name: '删除',
                icon: 'icon-trash',
                active: !parent,
            },
        ].filter(i => !i.active), item => {
            if (item.name === '删除') {
                this.tapRemove(parent);
                return;
            }
            this.data = {
                id: 0,
                parent_id: parent ? parent.id : 0,
                project_id: this.project.id,
                version_id: this.version,
                name: '',
                type: item.name.indexOf('文件夹') < 0 ? 0 : 1,
                method: 'GET',
                description: '',
                uri: '',
                header: [],
                request: [],
                response: [],
            };
            this.form.patchValue({
                name: '',
                method: 'GET',
                description: '',
                uri: '',
            });
        });
        return false;
    }

    public tapEdit(item: IDocApi) {
        item.expanded = !item.expanded;
        if (this.data && this.data.id === item.id) {
            return;
        }
        this.service.api(item.id).subscribe(res => {
            this.data = res;
            this.form.patchValue({
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
        if (!confirm('确定删除“' + item.name + '”文档？')) {
            return;
        }
        this.service.apiRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            const removeItem = (id: number, items: IDocApi[]) => {
                for (let i = 0; i < items.length; i++) {
                    const element = items[i];
                    if (element.id === id) {
                        items.splice(i, 1);
                        return true;
                    }
                    if (element.children && removeItem(id, element.children)) {
                        return true;
                    }
                }
                return false;
            };
            removeItem(item.id, this.catalog);
        });
    }

    public openVersion(modal: DialogBoxComponent) {
        this.editData = {
            name: ''
        };
        modal.open(() => {
            this.service.versionNew(this.project.id, this.version, this.editData.name).subscribe(_ => {
                this.toastrService.success('创建版本成功');
                this.refreshVersion();
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    public tapParse(modal: DialogBoxComponent, kind: number) {
        this.editData = {
            content: ''
        };
        modal.open(() => {
            this.service.apiParse(this.editData.content, kind).subscribe(res => {
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
            return !emptyValidate(this.editData.content);
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
