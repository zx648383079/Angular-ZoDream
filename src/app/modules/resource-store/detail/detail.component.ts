import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { mapFormat, parseNumber } from '../../../theme/utils';
import { FileTypeItems, IResource, IResourceCatalog } from '../model';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IResource;
    public content: SafeHtml;
    public isLoading = false;
    public tabIndex = 0;
    public catalogItems: IResourceCatalog[] = [];

    constructor(
        private sanitizer: DomSanitizer,
        private service: ResourceService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private themeSerive: ThemeService,
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
                this.themeSerive.setTitle(res.title);
                this.data = res;
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
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

    private loadCatalog() {
        this.service.resourceCatalog(this.data.id).subscribe(res => {
            this.catalogItems = res.data;
        });
    }

}
