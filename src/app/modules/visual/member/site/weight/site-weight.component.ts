import { Component, OnInit } from '@angular/core';
import { ComponentTypeItems, ISiteComponent, ISitePage, IThemeComponent } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { VisualService } from '../../visual.service';
import { DialogEvent, DialogService, SearchDialogEvent } from '../../../../../components/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
  selector: 'app-site-weight',
  templateUrl: './site-weight.component.html',
  styleUrls: ['./site-weight.component.scss']
})
export class SiteWeightComponent implements OnInit {

    public items: ISiteComponent[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        site: 0,
        type: 0,
        page: 1,
        per_page: 20
    };
    public typeItems = ComponentTypeItems;
    public pageData: ISitePage = {} as any;

    constructor(
        private service: VisualService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapBack() {
        history.back();
    }

    public tapCreate(modal: DialogEvent, item: ISiteComponent) {
        modal.open(() => {
            const data = {...this.pageData, site_component_id: item.id, thumb: item.thumb, site_id: item.site_id};
            this.service.sitePageSave(data).subscribe({
                next: res => {
                    this.toastrService.success($localize `Created page successfully, about to jump to edit`);
                    setTimeout(() => {
                        this.service.gotoEditor(res, false);
                    }, 1000);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => !emptyValidate(this.pageData.name));
    }

    public open(modal: SearchDialogEvent) {
        modal.open<IThemeComponent>((data: IThemeComponent[]) => {
            if (data.length < 1) {
                return;
            }
            this.service.siteComponentAdd({
                site: this.queries.site,
                id: data.map(i => i.id)
            }).subscribe({
                next: () => {
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
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
        this.service.siteComponentList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['site']);
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

    public tapRemove(item: ISiteComponent) {
        this.toastrService.confirm($localize `Are you sure to delete "${item.name}"?`, () => {
            this.service.siteComponentRemove(item.id).subscribe(res => {
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
