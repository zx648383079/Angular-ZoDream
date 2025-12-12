import { Component, effect, inject, input } from '@angular/core';
import { IGoodsGallery } from '../../model';
import { mediaIsFrame } from '../../../../components/media-player/util';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    standalone: false,
    selector: 'app-gallery-slider',
    templateUrl: './gallery-slider.component.html',
    styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent {
    private sanitizer = inject(DomSanitizer);


    public readonly items = input<IGoodsGallery[]>([]);
    public mediaType = 0;
    public mediaSrc: any = '';
    public index = 0;

    constructor() {
        effect(() => {
            if (this.items().length > this.index) {
                this.tapItem(this.index);
            }
        });
    }

    public tapItem(i: number) {
        if (i >= this.items().length) {
            this.mediaType = 0;
            this.mediaSrc = undefined;
            return;
        }
        this.index = i;
        const data = this.items()[this.index];
        if (data.type !== 1) {
            this.mediaType = 1;
        } else {
            this.mediaType = mediaIsFrame(data.file) ? 3 : 2;
        }
        this.mediaSrc = this.mediaType === 3 ? this.sanitizer.bypassSecurityTrustUrl(data.file) : data.file; 
    }
}
