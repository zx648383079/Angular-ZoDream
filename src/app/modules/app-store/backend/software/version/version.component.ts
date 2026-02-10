import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';
import { Location } from '@angular/common';
import { ISoftware, ISoftwareVersion } from '../../../model';
import { AppService } from '../../app.service';

@Component({
    standalone: false,
    selector: 'app-version',
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
    private readonly service = inject(AppService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly location = inject(Location);

    public readonly items = signal<ISoftwareVersion[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public software: ISoftware;
    public readonly editForm = form(signal<ISoftwareVersion>({
        id: 0,
        name: '',
        description: '',
        app_id: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            const softwareId = parseNumber(params.app);
            if (!softwareId) {
                this.location.back();
                return;
            }
            this.software = {id: softwareId} as any;
            this.service.software(softwareId).subscribe(res => {
                this.software = res;
            });
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent) {
        this.editForm().value.update(v => {
            v.id = 0;
            v.name = '';
            v.description = '';
            v.app_id = this.software.id;
            return {...v};
        });
        modal.open(() => {
            this.service.versionSave(this.editForm().value()).subscribe({
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.versionList({...queries, software: this.software.id}).subscribe({
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

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: ISoftwareVersion) {
        this.toastrService.confirm('确定删除“' + item.name + '”版本？', () => {
            this.service.versionRemove(item.id).subscribe(res => {
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
