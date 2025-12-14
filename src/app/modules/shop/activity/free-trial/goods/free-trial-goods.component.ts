import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IFreeTrialConfigure, IGoods, IGoodsGallery } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
  selector: 'app-free-trial-goods',
  templateUrl: './free-trial-goods.component.html',
  styleUrls: ['./free-trial-goods.component.scss']
})
export class FreeTrialGoodsComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public data: IGoods;
    public activity: IActivity<IFreeTrialConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public tabIndex = 0;
    public amount = 1;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.freeTrial({
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
