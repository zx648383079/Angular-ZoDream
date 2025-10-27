import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { mapFormat, parseNumber } from '../../../theme/utils';
import { FileTypeItems, IResource, IResourceCatalog } from '../model';
import { ResourceService } from '../resource.service';

@Component({
    standalone: false,
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IResource;
    public isLoading = false;
    public tabIndex = 0;
    public catalogItems: IResourceCatalog[] = [];

    constructor(
        private service: ResourceService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                history.back();
                return;
            }
            this.load(param.id);
        });
    }

    public formatType(val: number) {
        return mapFormat(val, FileTypeItems);
    }

    private load(id: any) {
        this.isLoading = true;
        this.service.resource(id).subscribe({
            next: res => {
                this.isLoading = false;
                res.score = parseNumber(res.score);
                this.themeService.titleChanged.next(res.title);
                this.data = res;
                this.catalogItems = res.file_catalog;
                // this.loadCatalog();
            },
            error: err => {
                this.isLoading = false;
                this.data = undefined;
                this.toastrService.error(err)
                history.back();
            }
        });
    }

    public tapCollect() {
        if (!this.data) {
            return;
        }
        this.service.collect(this.data.id).subscribe({
            next: res => {
                this.data.is_collected = res.is_collected;
                this.data.collect_count = res.collect_count;
            }, error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    private loadCatalog() {
        this.service.resourceCatalog(this.data.id).subscribe(res => {
            this.catalogItems = res.data;
        });
    }

 

}
