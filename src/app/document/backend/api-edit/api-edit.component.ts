import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IErrorResult } from '../../../theme/models/page';
import { IApiField, IDocApi, IProject, IProjectVersion } from '../../model';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
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
        method: ['GET', Validators.required],
        uri: ['', Validators.required],
        description: [''],
    });

    public data: IDocApi;
    public project: IProject;
    public version = 0;
    public catalog: IDocApi[] = [];
    public versionItems: IProjectVersion[] = [];
    public editData: any;
    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];
    


    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private modalService: NgbModal,
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
        e.stopPropagation();
        this.contextMenu.show(e.clientX, e.clientY, [
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
            {
                name: '取消',
                icon: 'icon-close'
            },
        ].filter(i => !i.active), item => {
            if (item.name === '取消') {
                return;
            }
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
        });
    }

    public tapSubmit() {
        if (!this.form.valid) {
            return;
        }
        const data = Object.assign({}, this.data, this.form.value);
        this.service.apiSave(data).subscribe(res => {
            this.toastrService.success('保存成功');
            this.data = res;
            this.appendData(res);
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
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
            this.toastrService.success('删除成功');
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

    public openVersion(modal: any) {
        this.editData = {
            name: ''
        };
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title'
        }).result.then(_ => {
            if (!this.editData.name || this.editData.name.trim().lenght < 1) {
                this.toastrService.warning('请输入版本号');
                return;
            }
            this.service.versionNew(this.project.id, this.version, this.editData.name).subscribe(res => {
                this.toastrService.success('创建版本成功');
            });
        });
    }

    public tapParse(modal: any, kind: number) {
        this.editData = {
            content: ''
        };
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title'
        }).result.then(_ => {
            if (!this.editData.content || this.editData.content.trim().lenght < 1) {
                this.toastrService.warning('请输入内容');
                return;
            }
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
        });
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