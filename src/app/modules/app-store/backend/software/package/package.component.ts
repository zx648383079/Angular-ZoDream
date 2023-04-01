import { Component, OnInit } from '@angular/core';
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
    selector: 'app-package',
    templateUrl: './package.component.html',
    styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

    public items: ISoftwarePackage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public software: ISoftware;
    public editData: ISoftwarePackage = {} as any;
    public osItems = ['windows', 'linux', 'android', 'ios'];
    public frameworkItems = ['any', 'x86', 'x64', 'ARM',];
    public urlTypeItems = FileTypeItems;

    constructor(
        private service: AppService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const softwareId = parseNumber(params.app);
            if (!softwareId) {
                history.back();
                return;
            }
            this.software = {id: softwareId} as any;
            this.service.software(softwareId, params.version).subscribe(res => {
                this.software = res;
            });
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: ISoftwarePackage) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            app_id: this.software.id,
            version_id: this.software.version.id,
            os: '',
            framework: '',
            url_type: 0,
            url: '',
            size: 0,
        };
        modal.open(() => {
            this.service.packageSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    public onFileUpload(e: UploadCustomEvent) {
        this.service.upload(e.file).subscribe({
            next: res => {
                this.editData.name = res.title;
                this.editData.size = res.size;
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
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.packageList({...queries, software: this.software.id}).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ISoftwarePackage) {
        this.toastrService.confirm('确定删除“' + item.name + '”程序包？', () => {
            this.service.packageRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }
}
