import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
export class AuctionGoodsComponent {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);

    public readonly data =signal<IGoods|null>(null);
    public readonly activity = signal<IActivity<IAuctionConfigure>|null>(null);
    public readonly galleryItems = signal<IGoodsGallery[]>([]);
    public readonly content = signal<SafeHtml|null>(null);
    public readonly regionSource = this.service.regionSource();
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
    private $timer?: Subscription;

    constructor() {
        this.route.params.subscribe(params => {
            this.service.auction({
                id: params.id,
                full: true,
            }).subscribe(res => {
                this.refreshBid(res.price!, res.log_count);
                const data = res.goods!;
                this.data.set(data);
                this.activity.set(res);
                this.themeService.titleChanged.next(data.seo_title || data.name!);
                this.content.set(this.sanitizer.bypassSecurityTrustHtml(data.content));
                this.galleryItems.set([{thumb: data.thumb, type: 0, file: data.picture}, ...(data.gallery ? data.gallery!.map(i => {
                    if (!i.thumb) {
                        i.thumb = i.file;
                    }
                    return i;
                }) : [])]);
                this.dataForm().value.update(v => {
                    v.min = this.minBid();
                    v.max = res.configure.fixed_price;
                    return {...v};
                });
                this.startTimer();
            });
        });
        this.destroyRef.onDestroy(() => this.stopTimer());
    }
    
    public readonly minBid = computed(() => {
        const data = this.activity();
        if (!data) {
            return 0;
        }
        if (data.price) {
            return parseFloat(data.price as any) + parseFloat(data.configure.step_price as any);
        }
        return data.configure.begin_price;
    });

    public tapBid() {
        const bid = this.dataForm.bid().value();
        this.service.auctionBid({
            activity: this.activity()!.id,
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
            this.activity()!.log_count = count;
        }
        this.activity()!.price = bid;
        this.dataForm.bid().value.set(this.minBid());
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
            this.$timer = undefined;
        }
    }

    private tapNext() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.auction({
            id: this.activity()!.id,
            full: false
        }).subscribe({
            next: res => {
                this.activity.set(res);
                this.refreshBid(res.price!, res.log_count);
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
