import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IGoods, IGoodsGallery, IGroupBuyConfigure } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';
import { form, max, min } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-group-buy-goods',
    templateUrl: './group-buy-goods.component.html',
    styleUrls: ['./group-buy-goods.component.scss']
})
export class GroupBuyGoodsComponent {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public data: IGoods;
    public activity: IActivity<IGroupBuyConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public readonly tabIndex = signal(0);
    public readonly regionSource = this.service.regionSource();
    public readonly dataForm = form(signal({
        stock: 0,
        amount: 1
    }), schemaPath => {
        min(schemaPath.amount, 1);
        max(schemaPath.amount, ({valueOf}) => valueOf(schemaPath.stock));
    });

    constructor() {
        this.route.params.subscribe(params => {
            this.service.groupBuy({
                id: params.id,
                full: true,
            }).subscribe(res => {
                this.dataForm.stock().value.set(res.goods.stock);
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
