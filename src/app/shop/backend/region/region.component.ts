import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import {
    IRegion
} from '../../../theme/models/shop';
import { emptyValidate } from '../../../theme/validators';
import {
    RegionService
} from '../region.service';

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

    public items: IRegion[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public parent: IRegion;
    public editData: IRegion = {} as any;

    constructor(
        private service: RegionService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            if (!res.parent_id || res.parent_id <= 0) {
                this.tapRefresh();
                return;
            }
            this.service.region(res.parent_id).subscribe(data => {
                this.parent = data;
                this.tapRefresh();
            });
        });
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.regionList({
            keywords: this.keywords,
            parent: this.parent?.id,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IRegion) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.regionRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

    public tapViewRegion(item?: IRegion) {
        this.parent = item;
        this.keywords = '';
        this.tapRefresh();
    }

    public tapParentRegion() {
        const parentId = this.parent ? this.parent.parent_id : 0;
        if (parentId < 1) {
            this.tapViewRegion();
            return;
        }
        this.service.region(parentId).subscribe(res => {
            this.tapViewRegion(res);
        });
    }

    open(modal: DialogBoxComponent, item?: IRegion) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: ''
        };
        modal.open(() => {
            this.service.regionSave({
                name: this.editData.name,
                parent_id: this.parent?.id,
                full_name: (this.parent ? this.parent.full_name + ' ' : '') + this.editData.name,
                id: this.editData?.id
            }).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.name));
    }
}
