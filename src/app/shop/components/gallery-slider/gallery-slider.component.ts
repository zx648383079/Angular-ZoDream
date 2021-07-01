import { Component, Input, OnInit } from '@angular/core';
import { IGoodsGallery } from '../../../theme/models/shop';

@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent implements OnInit {

    @Input() public items: IGoodsGallery[] = [];

    public index = 0;

    constructor() { }

    public get currentSrc() {
        if (this.index < 0 || this.index >= this.items.length) {
            return '';
        }
        return this.items[this.index].image;
    }

    ngOnInit() {
    }

}
