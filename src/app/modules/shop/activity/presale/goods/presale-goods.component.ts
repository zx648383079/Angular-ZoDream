import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IGoods, IGoodsGallery, IPreSaleConfigure } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
  selector: 'app-presale-goods',
  templateUrl: './presale-goods.component.html',
  styleUrls: ['./presale-goods.component.scss']
})
export class PresaleGoodsComponent implements OnInit {
    private service = inject(ActivityService);
    private route = inject(ActivatedRoute);
    private sanitizer = inject(DomSanitizer);
    private toastrService = inject(DialogService);
    private themeService = inject(ThemeService);


    public data: IGoods;
    public activity: IActivity<IPreSaleConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public tabIndex = 0;
    public amount = 1;

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.presale({
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

    public get endPrice() {
        return this.activity.price - this.activity.configure.deposit * this.activity.configure.deposit_scale;
    }

}
