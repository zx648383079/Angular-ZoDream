import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IGoods, IGoodsGallery, IPreSaleConfigure } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';
import { form, max, min } from '@angular/forms/signals';
import { NetSource } from '../../../../../components/form';
import { HttpClient } from '@angular/common/http';

@Component({
    standalone: false,
    selector: 'app-presale-goods',
    templateUrl: './presale-goods.component.html',
    styleUrls: ['./presale-goods.component.scss']
})
export class PresaleGoodsComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public data: IGoods;
    public activity: IActivity<IPreSaleConfigure>;
    public galleryItems: IGoodsGallery[] = [];
    public content: SafeHtml;
    public readonly tabIndex = signal(0);
    public readonly regionSource = new NetSource(inject(HttpClient), 'shop/region/tree', 3);
    public readonly dataForm = form(signal({
        stock: 0,
        amount: 1
    }), schemaPath => {
        min(schemaPath.amount, 1);
        max(schemaPath.amount, ({valueOf}) => valueOf(schemaPath.stock));
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.presale({
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

    public get endPrice() {
        return this.activity.price - this.activity.configure.deposit * this.activity.configure.deposit_scale;
    }

}
