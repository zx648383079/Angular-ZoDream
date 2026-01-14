import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IAuctionConfigure, IGoods, IGoodsGallery } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';
import { form, max, min } from '@angular/forms/signals';
import { interval, Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-auction-goods',
    templateUrl: './auction-goods.component.html',
    styleUrls: ['./auction-goods.component.scss']
})
export class AuctionGoodsComponent implements OnInit, OnDestroy {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public data: IGoods;
    public activity: IActivity<IAuctionConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public readonly tabIndex = signal(0);
    public readonly dataForm = form(signal({
        min: 0,
        max: 0,
        bid: 1
    }), schemaPath => {
        min(schemaPath.bid, ({valueOf}) => valueOf(schemaPath.min));
        max(schemaPath.bid, ({valueOf}) => valueOf(schemaPath.max));
    });
    private spaceTime = 10;
    private isLoading = false;
    private $timer: Subscription;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.auction({
                id: params.id,
                full: true,
            }).subscribe(res => {
                
                this.data = res.goods;
                this.activity = res;
                this.refreshBid(res.price, res.log_count);
                this.themeService.titleChanged.next(this.data.seo_title || this.data.name);
                this.content = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
                this.galleryItems = [].concat([{thumb: this.data.thumb, type: 0, file: this.data.picture}], this.data.gallery ? this.data.gallery.map(i => {
                    if (!i.thumb) {
                        i.thumb = i.file;
                    }
                    return i;
                }) : []);
                this.dataForm().value.update(v => {
                    v.min = this.minBid;
                    v.max = this.activity.configure.fixed_price;
                    return {...v};
                });
                this.startTimer();
            });
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
        const bid = this.dataForm.bid().value();
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
        this.dataForm.bid().value.set(this.minBid);
    }

    private startTimer() {
        if (this.$timer) {
            return;
        }
        this.$timer = interval(1000).subscribe(() => {
            if (this.isLoading) {
                return;
            }
            this.spaceTime --;
            if (this.spaceTime > 0) {
                return;
            }
            this.tapNext();
        });
    }

    private stopTimer() {
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
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
