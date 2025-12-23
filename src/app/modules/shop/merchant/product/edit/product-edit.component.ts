import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { FileUploadService } from '../../../../../theme/services';
import { IGoods, ICategory, IBrand, IAttributeGroup, IGoodsGallery, IAttribute, IProduct } from '../../../model';
import { ShopService } from '../../shop.service';
import { SkuFormComponent } from '../../../components';
import { form, required } from '@angular/forms/signals';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly skuForm = viewChild(SkuFormComponent);

    public data: IGoods;

    public readonly dataModel = signal({
        id: 0,
        name: '',
        cat_id: '',
        brand_id: '',
        series_number: '',
        keywords: '',
        thumb: '',
        picture: '',
        description: '',
        brief: '',
        content: '',
        price: 0,
        market_price: 0,
        stock: 1,
        attribute_group_id: '',
        weight: 0,
        shipping_id: '',
        is_best: 0,
        is_hot: 0,
        is_new: 0,
        status: '10',
        admin_note: '',
        type: 0,
        position: 99,
        seo_title: '',
        seo_description: '',
        seo_link: '',
        gallery: [],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];
    public typeItems: IAttributeGroup[] = [];
    public attrItems: IAttribute[] = [];
    public productItems: IProduct[] = [];

    constructor() {
        this.service.batch({
            category: {},
            group: {},
            brand: {}
        }).subscribe(res => {
            this.categories = res.category;
            this.typeItems = res.group;
            this.brandItems = res.brand;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.goods(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                    id: res.id,
                    cat_id: res.cat_id as any,
                    brand_id: res.brand_id as any,
                    name: res.name,
                    series_number: res.series_number,
                    keywords: res.keywords,
                    thumb: res.thumb,
                    picture: res.picture,
                    description: res.description,
                    brief: res.brief,
                    content: res.content,
                    price: res.price,
                    market_price: res.market_price,
                    stock: res.stock,
                    attribute_group_id: res.attribute_group_id as any,
                    weight: res.weight,
                    shipping_id: res.shipping_id as any,
                    is_best: res.is_best,
                    is_hot: res.is_hot,
                    is_new: res.is_new,
                    status: res.status as any,
                    admin_note: res.admin_note,
                    type: res.type,
                    position: res.position,
                    seo_title: res.seo_title,
                    seo_description: res.seo_description,
                    seo_link: res.seo_link,
                    gallery: res.gallery || []
                });
                this.productItems = res.products || [];
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapCreateSn() {
        this.service.createSn().subscribe(res => {
            this.dataForm.series_number().value.set(res.data);
        });
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();

        data.attr = this.skuForm().attrFormData();
        data.products = this.skuForm().productFormData();
        e?.enter();
        this.service.goodsSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapGroupChange() {
        const groupId = parseNumber(this.dataForm.attribute_group_id().value());
        if (groupId < 1) {
            this.attrItems = [];
            this.productItems = [];
            return;
        }
        this.service.goodsAttribute(groupId, this.data?.id).subscribe(res => {
            this.attrItems = res.attr_list;
            this.productItems = res.product_list;
        });
    }

    public uploadFile(event: any, name: string = 'thumb') {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.dataForm[name]().value.set(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.dataForm[name]().value(), '_blank');
    }

}
