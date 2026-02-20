import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IBargainConfigure, IGoods, IGoodsGallery } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
    selector: 'app-bargain-goods',
    templateUrl: './bargain-goods.component.html',
    styleUrls: ['./bargain-goods.component.scss']
})
export class BargainGoodsComponent {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public data: IGoods;
    public activity: IActivity<IBargainConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public readonly tabIndex = signal(0);
    public readonly regionSource = this.service.regionSource();
    public amount = 1;
    public dataType: 0|1|2 = 0; // 0 没有记录 1 别人的记录 2 自己的记录
    public log: any;

    constructor() {
        this.route.params.subscribe(params => {
            this.service.bargain({
                id: params.id,
                log: params.log,
            }).subscribe(res => {
                this.data = res.goods;
                this.activity = res;
                if (res.log) {
                    this.log = res.log;
                    this.dataType = res.log?.id === res.join_log?.id ? 2 : 1;
                }  else if (res.join_log) {
                    this.log = res.join_log;
                    this.dataType = 2;
                } 
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

    public tapCut() {
        this.service.bargainCut({
            activity: this.activity.id,
            log: this.log.id
        }).subscribe({
            next: res => {
                this.log = res;
                this.toastrService.success('砍价成功');
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapJoin() {
        if (this.activity.join_log) {
            this.dataType = 2;
            this.log = this.activity.join_log;
            return;
        }
        this.service.bargainApply({
            activity: this.activity.id,
        }).subscribe({
            next: res => {
                this.toastrService.success('开始砍价');
                this.dataType = 2;
                this.log = res;
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapInviteCut() {

    }

}
