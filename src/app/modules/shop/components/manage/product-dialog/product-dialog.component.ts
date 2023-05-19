import { Component, Input } from '@angular/core';
import { IGoods, IGoodsAttr, IGoodsResult, IProduct } from '../../../model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {

    @Input() public value: IGoods;
    @Input() public visible = false;
    public amount = 1;
    public stock = 0;
    public amountVisible = false;
    private confirmFn: (data: IGoodsResult) => void;

    constructor(
        private http: HttpClient,
    ) { }

    public open(data: IGoodsResult);
    public open(data: IGoodsResult, confirm: (data: IGoodsResult) => void);
    public open(data: IGoodsResult, confirm?: (data: IGoodsResult) => void) {
        this.value = data as IGoods;
        this.visible = true;
        this.confirmFn = confirm;
        this.http.get<IGoods>('shop/admin/goods/preview', {
            params: {
                id: data.id
            },
        }).subscribe(res => {
            this.value = res;
        });
    }

    public close() {
        this.visible = false;
    }

    public tapYes() {
        const product = this.selectedProduct;
        const data: IGoodsResult = {...this.value,
            product_id: product?.id, attribute_id: this.selectedProperties.join(','),
            attribute_value: this.selectedPropertiesLabel
        };
        if (this.confirmFn) {
            this.confirmFn(data);
        }
        this.close();
    }

    public toggleSelected(i: number, j: number) {
        const group = this.value.properties[i];
        if (group.type == 2) {
            group.attr_items[j].checked = !group.attr_items[j].checked;
            return;
        }
        group.attr_items.forEach((item, index) => {
            item.checked = index === j;
        });
        const product = this.selectedProduct;
        this.stock = product?.stock || 0;
    }

    private eachSelectedProperty(cb: (item: IGoodsAttr, type: number) => void) {
        for (const item of this.value.properties) {
            for (const attr of item.attr_items) {
                if (attr.checked) {
                    cb(attr, item.type);
                }
            }
        }
    }

    private get selectedPropertiesLabel(): string {
        const items = [];
        for (const item of this.value.properties) {
            const labels = [];
            for (const attr of item.attr_items) {
                if (attr.checked) {
                    labels.push(attr.value);
                }
            }
            if (labels.length > 0) {
                items.push(`${item.name}:${labels.join(',')}`);
            }
        }
        return items.join(';');
    }

    private get selectedProperties(): number[] {
        const items = [];
        this.eachSelectedProperty(item => {
            items.push(item.id);
        });
        return items;
    }

    private get selectedProduct(): IProduct|undefined {
        const items = [];
        for (const item of this.value.properties) {
            if (item.type === 2) {
                continue;
            }
            for (const attr of item.attr_items) {
                if (attr.checked) {
                    items.push(attr.id);
                }
            }
        }
        return this.getProductByAttribute(items);
    }

    private getProductByAttribute(attrs: any[]): IProduct|undefined {
        if (attrs.length < 1) {
            return;
        }
        const label = attrs.sort().join(',');
        for (const item of this.value.products) {
            if (item.attributes === label) {
                return item;
            }
        }
    }

    private indexOf(items: any[], value: any): number {
        for (let i = 0; i < items.length; i++) {
            if (items[i] == value) {
                return i;
            }
        }
        return -1;
    }
}
