import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { IActivity, IAuctionConfigure, IGoods, IGoodsGallery } from '../../../../theme/models/shop';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-auction-goods',
  templateUrl: './auction-goods.component.html',
  styleUrls: ['./auction-goods.component.scss']
})
export class AuctionGoodsComponent implements OnInit {

    public data: IGoods;
    public activity: IActivity<IAuctionConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public tabIndex = 0;
    public bid = 0;

    constructor(
        private service: ActivityService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.auction(params.id).subscribe(res => {
                this.data = res.goods;
                this.activity = res;
                this.refreshBid(res.bid, res.bid_count);
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

    public get minBid() {
        if (!this.activity) {
            return 0;
        }
        if (this.activity.bid) {
            return parseFloat(this.activity.bid as any) + parseFloat(this.activity.configure.step_price as any);
        }
        return this.activity.configure.begin_price;
    }

    public tapBid() {
        const bid = this.bid;
        this.service.auctionBid({
            activity: this.activity.id,
            money: bid
        }).subscribe({
            next: _ => {
                this.toastrService.success('出价成功');
                this.refreshBid(bid);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private refreshBid(bid: number, count?: number) {
        if (count) {
            this.activity.bid_count = count;
        }
        this.activity.bid = bid;
        this.bid = this.minBid;
    }
}
