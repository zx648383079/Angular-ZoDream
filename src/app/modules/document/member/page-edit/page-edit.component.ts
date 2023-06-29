import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { emptyValidate } from '../../../../theme/validators';
import { IDocPage, IDocTreeItem, IProject, IProjectVersion } from '../../model';
import { DocumentService } from '../document.service';
import { SearchService } from '../../../../theme/services';
import { NavToggle, SearchEvents } from '../../../../theme/models/event';
import { treeRemoveId } from '../../shared';

@Component({
  selector: 'app-page-edit',
  templateUrl: './page-edit.component.html',
  styleUrls: ['./page-edit.component.scss']
})
export class PageEditComponent implements OnInit, OnDestroy {
    public form = this.fb.group({
        name: ['', Validators.required],
        content: [''],
    });

    public data: IDocPage;
    public project: IProject;
    public version = 0;
    public catalog: IDocPage[] = [];
    public versionItems: IProjectVersion[] = [];
    public editData: any = {};


    constructor(
        private fb: FormBuilder,
        private service: DocumentService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, NavToggle.Mini);
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

    ngOnDestroy(): void {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, NavToggle.Unreal);
    }

    public tapBack() {
        history.back();
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
            name: '',
            content: '',
        } as any;
        this.form.patchValue({
            name: '',
            content: '',
        });
    }

    public tapEdit(item: IDocPage) {
        this.service.page(item.id).subscribe(res => {
            this.data = res;
            this.form.patchValue({
                name: res.name,
                content: res.content
            });
            document.documentElement.scrollTop = 0;
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.form.valid) {
            return;
        }
        const data = Object.assign({}, this.data, this.form.value);
        e?.enter();
        this.service.pageSave(data).subscribe({
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

    private appendData(data: IDocPage) {
        const findParent = (id: number, items: IDocPage[]) => {
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

    public tapRemove(item: IDocPage) {
        this.toastrService.confirm('确定删除“' + item.name + '”文档？', () => {
            this.service.pageRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.catalog = treeRemoveId(this.catalog, item.id);
            });
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

}
