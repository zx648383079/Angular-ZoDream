import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActivity, IGoods, IGoodsGallery, IPreSaleConfigure } from '../../../model';
import { ThemeService } from '../../../../../theme/services';
import { ActivityService } from '../../activity.service';
import { form, max, min } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-presale-goods',
    templateUrl: './presale-goods.component.html',
    styleUrls: ['./presale-goods.component.scss']
})
export class PresaleGoodsComponent {
    private readonly service = inject(ActivityService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly data =signal<IGoods|null>(null);
    public readonly activity = signal<IActivity<IPreSaleConfigure>|null>(null);
    public readonly galleryItems = signal<IGoodsGallery[]>([]);
    public readonly content = signal<SafeHtml|null>(null);
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
            this.service.presale({
                id: params.id,
                full: true,
            }).subscribe(res => {
                const data = res.goods!;
                this.dataForm.stock().value.set(data.stock);
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
            });
        });
    }

    public readonly endPrice = computed(() => {
        return this.activity()!.price! - this.activity()!.configure.deposit * this.activity()!.configure.deposit_scale;
    });

}
