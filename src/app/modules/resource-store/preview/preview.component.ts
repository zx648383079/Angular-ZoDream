import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
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
    standalone: false,
    selector: 'app-res-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
    private readonly service = inject(ResourceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly location = inject(Location);

    public readonly data = signal<IResource>(null);
    public readonly isLoading = signal(false);
    public previewSrc: SafeResourceUrl;
    public resizeItems: ISizeItem[] = [
        {name: '全屏'},
        {name: '768x1024', width: 768, height: 1024},
        {name: '1024x768', width: 1024, height: 768},
        {name: '375x812', width: 375, height: 812},
        {name: '812x375', width: 812, height: 375},
    ];
    public readonly resizeIndex = signal(-1);

    public readonly frameStyle = computed(() => {
        if (this.resizeIndex() < 1) {
            return {};
        }
        const item = this.resizeItems[this.resizeIndex()];
        return {
            width: item.width + 'px',
            height: item.height + 'px'
        };
    });

    constructor() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                this.location.back();
                return;
            }
            this.load(param.id);
        });
    }

    private load(id: any) {
        this.isLoading.set(true);
        this.service.resourcePreview(id).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.themeService.titleChanged.next(res.title);
                this.data.set(res);
                this.previewSrc = this.sanitizer.bypassSecurityTrustResourceUrl(res.preview_url);
            },
            error: err => {
                this.isLoading.set(false);
                this.data.set(null);
                this.toastrService.error(err)
                this.location.back();
            }
        });
    }

}
