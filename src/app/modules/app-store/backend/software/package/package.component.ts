import { form, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { UploadCustomEvent } from '../../../../../components/form';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { emptyValidate } from '../../../../../theme/validators';
import { FileTypeItems, ISoftware, ISoftwarePackage } from '../../../model';
import { AppService } from '../../app.service';

@Component({
    standalone: false,
    selector: 'app-package',
    templateUrl: './package.component.html',
    styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
    private readonly service = inject(AppService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ISoftwarePackage[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public software: ISoftware;
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        app_id: 0,
        version_id: 0,
        os: '',
        framework: '',
        url_type: '0',
        url: '',
        size: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });
    public osItems = ['windows', 'linux', 'android', 'ios'];
    public frameworkItems = ['any', 'x86', 'x64', 'ARM',];
    public urlTypeItems = FileTypeItems;

    public readonly urlType = computed(() => parseNumber(this.editForm.url_type().value()));

    ngOnInit() {
        this.route.params.subscribe(params => {
            const softwareId = parseNumber(params.app);
            if (!softwareId) {
                history.back();
                return;
            }
            this.software = {id: softwareId, version: {id: params.version}} as any;
            this.service.software(softwareId, params.version).subscribe(res => {
                this.software = res;
            });
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: ISoftwarePackage) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.app_id = this.software.id;
            v.version_id = this.software.version.id;
            v.os = item?.os ?? '';
            v.framework = item?.framework ?? '';
            v.url_type = item?.url_type as any ?? '0';
            v.url = item?.url ?? '';
            v.size = item?.size ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.packageSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public onFileUpload(e: UploadCustomEvent) {
        this.service.upload(e.file).subscribe({
            next: res => {
                this.editForm().value.update(v => {
                    v.name = res.title;
                    v.size = res.size;
                    return v;
                });
                e.next(res);
            },
            error: err => {
                this.toastrService.error(err);
                e.next();
            }
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }


    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.packageList({...queries,
            software: this.software.id,
            version: this.software.version.id
        }).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: ISoftwarePackage) {
        this.toastrService.confirm('确定删除“' + item.name + '”程序包？', () => {
            this.service.packageRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        })
    }
}
