import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAttribute, IAttributeGroup, IBrand, ICategory, IGoods, IGoodsAttr, IProduct } from '../../../../theme/models/shop';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { AttributeService } from '../attribute.service';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

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
        price: [''],
        market_price: [0],
        stock: [1],
        attribute_group_id: [0],
        weight: [0],
        shipping_id: [0],
        is_best: [0],
        is_hot: [0],
        is_new: [0],
        status: ['10'],
        admin_note: [''],
        type: ['0'],
        position: ['99'],
    });

    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];
    public typeItems: IAttributeGroup[] = [];
    public gallaryItems: string[] = [];
    public attrItems: IAttribute[] = [];
    public productItems: IProduct[] = [];

    @ViewChild('imageBox') imageElement: ElementRef;

    constructor(
        private service: GoodsService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private uploadService: FileUploadService,
        private attrService: AttributeService,
    ) {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
        this.service.brandAll().subscribe(res => {
            this.brandItems = res.data;
        });
        this.attrService.groupAll().subscribe(res => {
            this.typeItems = res.data;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.goods(params.id).subscribe(res => {
                this.data = res;
                this.form.setValue({
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
                });
            });
        });
    }

    get imageBox() {
        return this.imageElement.nativeElement as HTMLDivElement;
    }

    ngAfterViewInit() {
        this.imageBox.ondrop = (ev) => {
            this.fileDrog(ev.dataTransfer.files);
            return false;
        };
        this.imageBox.ondragover = () => false;
    }

    public tapBack() {
        history.back();
    }

    public tapCreateSn() {
        this.service.createSn().subscribe(res => {
            this.form.get('series_number').setValue(res.data);
        });
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IGoods = this.form.value;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.categorySave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
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
            this.attrItems = res.attr_list.map(item => {
                if (typeof item.input_type === 'string') {
                    item.input_type = parseInt(item.input_type, 10);
                }
                if (typeof item.type === 'string') {
                    item.type = parseInt(item.type, 10);
                }
                if (item.input_type === 1) {
                    item.default_value = this.strToArr(item.default_value);
                }
                if ((!item.attr_items || item.attr_items.length < 1) && item.type < 1) {
                    item.attr_items = [{value: item.input_type === 1 ? item.default_value[0] : ''}];
                }
                if (item.type > 0 && item.input_type === 1 && item.attr_items.length < item.default_value.length){
                    for (const val of item.default_value) {
                        if (!this.inArr(val, item.attr_items)) {
                            item.attr_items.push({value: val});
                        }
                    }
                }
                return item;
            });
            this.productItems = res.product_list;
        });
    }

    public tapAttrAdd(item: IAttribute) {
        if (item.input_type === 1) {
            return;
        }
        if (!item.new_value) {
            this.toastrService.warning('请输入属性内容');
            return;
        }
        if (this.inArr(item.new_value, item.attr_items)) {
            this.toastrService.warning('属性已存在');
            return;
        }
        item.attr_items.push(item.type > 1 ? {
            value: item.new_value,
            price: parseFloat(item.new_price.toString()) || 0,
        } : {
            value: item.new_value
        });
        item.new_value = '';
        if (item.type > 1) {
            item.new_price = 0;
        }
    }

    public tapAttrRemove(item: IAttribute, attr: IGoodsAttr) {
        if (item.type < 1 || item.input_type > 0) {
            return;
        }
        for (let i = item.attr_items.length - 1; i >= 0; i --) {
            if (item.attr_items[i].value === attr.value) {
                item.attr_items.splice(i, 1);
            }
        }
    }

    public tapAttrCheck(item: IAttribute, attr: IGoodsAttr) {
        if (item.type !== 1) {
            return;
        }
        attr.checked = !attr.checked;
    }

    private inArr(val: string, items: any[]): boolean {
        for (const item of items) {
            if (val === item.value.trim()) {
                return true;
            }
        }
        return false;
    }

    private strToArr(val: any): string[] {
        if (typeof val === 'object') {
            return val;
        }
        const items: string[] = [];
        val.toString().split('\n').forEach((item: string) => {
            item = item.replace('\r', '').trim();
            if (!item || item.length < 1) {
                return;
            }
            if (items.indexOf(item) >= 0) {
                return;
            }
            items.push(item);
        });
        return items;
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

    public tapRemoveGallary(i: number) {
        this.gallaryItems.splice(i, 1);
    }

    public uploadImages(event: any) {
        this.fileDrog(event.target.files as FileList);
    }

    public fileDrog(files: FileList) {
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.indexOf('image/') < 0) {
                continue;
            }
            form.append('file[]', file, file.name);
        }
        if (!form.has('file[]')) {
            return;
        }
        // 这样就可以多文件上传
        this.uploadService.uploadImages(form).subscribe(res => {
            for (const file of res) {
                this.gallaryItems.push(file.url);
            }
        });
    }

}
