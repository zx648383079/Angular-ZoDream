import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { IResource } from '../model';
import { ResourceService } from '../resource.service';

interface ISizeItem {
    width?: number;
    height?: number;
    name: string;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    public data: IResource;
    public isLoading = false;
    public previewSrc: SafeResourceUrl;
    public resizeItems: ISizeItem[] = [
        {name: '全屏'},
        {name: '768x1024', width: 768, height: 1024},
        {name: '1024x768', width: 1024, height: 768},
        {name: '375x812', width: 375, height: 812},
        {name: '812x375', width: 812, height: 375},
    ];
    public resizeIndex = -1;

    constructor(
        private service: ResourceService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private themeSerive: ThemeService,
        private sanitizer: DomSanitizer,
    ) { }

    public get frameStyle() {
        if (this.resizeIndex < 1) {
            return {};
        }
        const item = this.resizeItems[this.resizeIndex];
        return {
            width: item.width + 'px',
            height: item.height + 'px'
        };
    }

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                history.back();
                return;
            }
            this.load(param.id);
        });
    }

    private load(id: any) {
        this.isLoading = true;
        this.service.resourcePreview(id).subscribe({
            next: res => {
                this.isLoading = false;
                this.themeSerive.setTitle(res.title);
                this.data = res;
                this.previewSrc = this.sanitizer.bypassSecurityTrustResourceUrl(res.preview_url);
            },
            error: err => {
                this.isLoading = false;
                this.data = undefined;
                this.toastrService.error(err)
                history.back();
            }
        });
    }

}
