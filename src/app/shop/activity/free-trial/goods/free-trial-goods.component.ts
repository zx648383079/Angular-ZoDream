import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { IActivity, IFreeTrialConfigure, IGoods, IGoodsGallery } from '../../../../theme/models/shop';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-free-trial-goods',
  templateUrl: './free-trial-goods.component.html',
  styleUrls: ['./free-trial-goods.component.scss']
})
export class FreeTrialGoodsComponent implements OnInit {

    public data: IGoods;
    public activity: IActivity<IFreeTrialConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public tabIndex = 0;
    public amount = 1;

    constructor(
        private service: ActivityService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.freeTrial({
                id: params.id,
                full: true,
            }).subscribe(res => {
                this.data = res.goods;
                this.activity = res;
                this.themeService.setTitle(this.data.seo_title || this.data.name);
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
                this.galleryItems = [].concat([{thumb: this.data.thumb, image: this.data.picture}], this.data.gallery ? this.data.gallery.map(i => {
                        if (!i.thumb) {
                            i.thumb = i.image;
                        }
                        return i;
                    }) : []);
                });
        });
    }

}
