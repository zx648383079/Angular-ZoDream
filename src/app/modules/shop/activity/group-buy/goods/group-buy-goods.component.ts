import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IGoods, IGoodsGallery, IGroupBuyConfigure } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
  selector: 'app-group-buy-goods',
  templateUrl: './group-buy-goods.component.html',
  styleUrls: ['./group-buy-goods.component.scss']
})
export class GroupBuyGoodsComponent implements OnInit {

    public data: IGoods;
    public activity: IActivity<IGroupBuyConfigure>;
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
            this.service.groupBuy({
                id: params.id,
                full: true,
            }).subscribe(res => {
                this.data = res.goods;
                this.activity = res;
                this.themeService.titleChanged.next(this.data.seo_title || this.data.name);
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
                this.galleryItems = [].concat([{thumb: this.data.thumb, type: 0, file: this.data.picture}], this.data.gallery ? this.data.gallery.map(i => {
                    if (!i.thumb) {
                        i.thumb = i.file;
                    }
                    return i;
                }) : []);
            });
        });
    }

}
