import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IErrorResult } from '../../../../theme/models/page';
import { emptyValidate } from '../../../../theme/validators';
import { IDocPage, IDocTreeItem, IProject, IProjectVersion } from '../../model';
import { DocumentService } from '../document.service';
import { ThemeService } from '../../../../theme/services';
import { NavigationDisplayMode } from '../../../../theme/models/event';
import { treeRemoveId } from '../../shared';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-page-edit',
    templateUrl: './page-edit.component.html',
    styleUrls: ['./page-edit.component.scss']
})
export class PageEditComponent {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly location = inject(Location);
    private readonly destroyRef = inject(DestroyRef);

    public readonly dataModel = signal({
        name: '',
        content: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public readonly data = signal<IDocPage|null>(null);
    public readonly project = signal<IProject|null>(null);
    public readonly version = signal(0);
    public readonly catalog = signal<IDocPage[]>([]);
    public readonly versionItems = signal<IProjectVersion[]>([]);
    public readonly editForm = form(signal({
        name: ''
    }));

    constructor() {
        this.themeService.screenSwitch(this.destroyRef, NavigationDisplayMode.Compact);
        this.route.params.subscribe(params => {
            if (!params.project) {
                return;
            }
            this.version.set(params.version ? parseInt(params.version, 10) : 0);
            this.service.project(params.project).subscribe(res => {
                this.project.set(res);
                this.loadCatalog(res.id, params.id)
            });

        });
    }

    public tapBack() {
        this.location.back();
    }

    private loadCatalog(project: any, id: any) {
        this.service.catalogAll(project, this.version).subscribe(res => {
            this.catalog.set(res.data);
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
        this.service.versionAll(this.project()!.id).subscribe(res => {
            this.versionItems.set(res.data);
        });
    }

    public onVersionChange() {
        this.service.catalogAll(this.project()!.id, this.version).subscribe(res => {
            this.catalog.set(res.data);
        });
    }

    public onCreate(data: IDocTreeItem) {
        this.data.update((v: any) => ({...v, project_id: this.project()!.id,
            version_id: this.version(),
            name: '',
            content: '',}));
        this.dataModel.set({
            name: '',
            content: '',
        });
    }

    public tapEdit(item: IDocTreeItem|undefined) {
        if (!item) {
            return;
        }
        this.service.page(item.id).subscribe(res => {
            this.data.set(res);
            this.dataModel.set({
                name: res.name,
                content: res.content
            });
            document.documentElement.scrollTop = 0;
        });
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (!this.dataForm().valid()) {
            return;
        }
        const data = Object.assign({}, this.data, this.dataForm().value());
        e?.enter();
        this.service.pageSave(data).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.data.set(res);
                this.appendData(res);
            },
            error: (err: IErrorResult) => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

    private appendData(data: IDocPage) {
        const findParent = (id: number, items: IDocPage[]): IDocPage[]|undefined => {
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
            return undefined;
        };
        const children = findParent(data.parent_id, this.catalog())!;
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
                this.catalog.update(v => treeRemoveId(v, item.id));
            });
        });
    }

    public openVersion(modal: DialogEvent) {
        this.editForm.name().value.set('');
        modal.open(() => {
            this.service.versionNew(this.project()!.id, this.version(), this.editForm.name().value()).subscribe(_ => {
                this.toastrService.success('创建版本成功');
                this.refreshVersion();
            });
        }, () => {
            return !emptyValidate(this.editForm.name().value());
        });
    }

}
