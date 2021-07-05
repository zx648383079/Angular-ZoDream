import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class AuctionGoodsComponent implements OnInit, OnDestroy {

    public data: IGoods;
    public activity: IActivity<IAuctionConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public tabIndex = 0;
    public bid = 0;
    private spaceTime = 10;
    private isLoading = false;
    private timer = 0;

    constructor(
        private service: ActivityService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.auction({
                id: params.id,
                full: true,
            }).subscribe(res => {
                this.data = res.goods;
                this.activity = res;
                this.refreshBid(res.price, res.log_count);
                this.themeService.setTitle(this.data.seo_title || this.data.name);
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
                this.galleryItems = [].concat([{thumb: this.data.thumb, image: this.data.picture}], this.data.gallery ? this.data.gallery.map(i => {
                        if (!i.thumb) {
                            i.thumb = i.image;
                        }
                        return i;
                    }) : []);
                });
                this.startTimer();
        });
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    public get minBid() {
        if (!this.activity) {
            return 0;
        }
        if (this.activity.price) {
            return parseFloat(this.activity.price as any) + parseFloat(this.activity.configure.step_price as any);
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
            this.activity.log_count = count;
        }
        this.activity.price = bid;
        this.bid = this.minBid;
    }

    private startTimer() {
        if (this.timer > 0) {
            return;
        }
        this.timer = window.setInterval(() => {
            if (this.isLoading) {
                return;
            }
            this.spaceTime --;
            if (this.spaceTime > 0) {
                return;
            }
            this.tapNext();
        }, 1000);
    }

    private stopTimer() {
        if (this.timer > 0) {
            window.clearInterval(this.timer);
            this.timer = 0;
        }
    }

    private tapNext() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.auction({
            id: this.activity.id,
            full: false
        }).subscribe({
            next: res => {
                this.activity = res;
                this.refreshBid(res.price, res.log_count);
                this.spaceTime = 10;
                this.isLoading = false;
                this.startTimer();
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }
}
