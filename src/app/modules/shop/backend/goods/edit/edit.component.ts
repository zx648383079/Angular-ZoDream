import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IAttribute, IAttributeGroup, IBrand, ICategory, IGoods, IGoodsAttr, IGoodsGallery, IProduct } from '../../../model';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { AttributeService } from '../attribute.service';
import { GoodsService } from '../goods.service';
import { SkuFormComponent } from '../sku-form/sku-form.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    @ViewChild(SkuFormComponent)
    public skuForm: SkuFormComponent;

    public data: IGoods;

    public form = this.fb.group({
        name: ['', Validators.required],
        cat_id: [0],
        brand_id: [0],
        series_number: [''],
        keywords: [''],
        thumb: [''],
        picture: [''],
        description: [''],
        brief: [''],
        content: [''],
        price: [0],
        market_price: [0],
        stock: [1],
        attribute_group_id: [0],
        weight: [0],
        shipping_id: [0],
        is_best: [0],
        is_hot: [0],
        is_new: [0],
        status: [10],
        admin_note: [''],
        type: [0],
        position: [99],
        seo_title: [''],
        seo_description: [''],
        seo_link: [''],
    });

    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];
    public typeItems: IAttributeGroup[] = [];
    public gallaryItems: IGoodsGallery[] = [];
    public attrItems: IAttribute[] = [];
    public productItems: IProduct[] = [];

    constructor(
        private service: GoodsService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
        private attrService: AttributeService,
    ) {
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
                this.form.patchValue({
                    cat_id: res.cat_id,
                    brand_id: res.brand_id,
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
                    attribute_group_id: res.attribute_group_id,
                    weight: res.weight,
                    shipping_id: res.shipping_id,
                    is_best: res.is_best,
                    is_hot: res.is_hot,
                    is_new: res.is_new,
                    status: res.status,
                    admin_note: res.admin_note,
                    type: res.type,
                    position: res.position,
                    seo_title: res.seo_title,
                    seo_description: res.seo_description,
                    seo_link: res.seo_link,
                });
                this.gallaryItems = res.gallery || [];
                this.productItems = res.products || [];
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapCreateSn() {
        this.service.createSn().subscribe(res => {
            this.form.get('series_number').setValue(res.data);
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.attr = this.skuForm.attrFormData();
        data.products = this.skuForm.productFormData();
        data.gallery = this.gallaryItems;
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
        const groupId = this.form.get('attribute_group_id').value;
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
            this.form.get(name).setValue(res.url);
        });
    }

    public tapPreview(name: string) {
        window.open(this.form.get(name).value, '_blank');
    }

    
}
