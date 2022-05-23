import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { DialogService } from '../../../../../components/dialog';
import { IAttribute, IGoodsAttr, IProduct } from '../../../model';

interface ISkuRow {
    rowspan: number;
    id: number;
    value: string;
}

interface ISkuSpec {
    sku: string;
    rows: ISkuRow[];
    form: IProduct;
}

@Component({
    selector: 'app-sku-form',
    templateUrl: './sku-form.component.html',
    styleUrls: ['./sku-form.component.scss']
})
export class SkuFormComponent implements OnChanges {

    @Input() public attrItems: IAttribute[] = [];
    @Input() public productItems: IProduct[] = [];
    @Input() public linkLine = ',';
    public radioItems: IAttribute[] = [];
    public specItems: ISkuSpec[] = [];

    public batchData = {
        series_number: '',
        price: 0,
        market_price: 0,
        stock: 0,
        weight: 0,
    };

    constructor(private toastrService: DialogService) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.attrItems) {
            this.formatAttr();
        }
        if (changes.productItems) {
            this.formatProduct();
        }
    }

    public attrFormData(): IGoodsAttr[] {
        const items = [];
        for (const item of this.attrItems) {
            for (const attr of item.attr_items) {
                items.push({
                    id: attr.id || 0,
                    value: attr.value,
                    price: attr.price || 0,
                    attribute_id: item.id,
                });
            }
        }
        return items;
    }

    public productFormData(): IProduct[] {
        const items = [];
        for (const item of this.specItems) {
            items.push({
                id: item.form.id || 0,
                attributes: item.sku,
                series_number: item.form.series_number || '',
                price: item.form.price || 0,
                market_price: item.form.market_price || 0,
                stock: item.form.stock || 0,
                weight: item.form.weight || 0,
            });
        }
        return items;
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
        for (let i = item.attr_items.length - 1; i >= 0; i--) {
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
        this.buildAttrList();
    }

    public tapBatch() {
        for (const item of this.specItems) {
            for (const key in this.batchData) {
                if (Object.prototype.hasOwnProperty.call(this.batchData, key) && this.batchData[key]) {
                    item.form[key] = this.batchData[key];
                }
            }
        }
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


    private getRadioAttr() {
        const items: IAttribute[] = [];
        for (const item of this.attrItems) {
            if (item.type !== 1) {
                continue;
            }
            const newItem = {name: item.name, attr_items: item.attr_items.filter(attr => attr.checked)};
            items.push(newItem as any);
        }
        return items;
    }

    private buildAttrList() {
        // 规格组合总数 (table行数)
        let totalRow = 1;
        const attrList = this.getRadioAttr();
        for (const item of attrList) {
            totalRow *= item.attr_items.length;
        }
        // 遍历tr 行
        const specList: ISkuSpec[] = [];
        for (let i = 0; i < totalRow; i++) {
            const rowData: ISkuRow[] = [];
            let rowCount = 1;
            const specSkuIdAttr = [];
            // 遍历td 列
            for (const item of attrList) {
                const skuValues = item.attr_items;
                rowCount *= skuValues.length;
                const anInterBankNum = (totalRow / rowCount);
                const point = ((i / anInterBankNum) % skuValues.length);
                if (0 === (i % anInterBankNum)) {
                    rowData.push({
                        rowspan: anInterBankNum,
                        id: skuValues[point].id,
                        value: skuValues[point].value
                    });
                }
                specSkuIdAttr.push(skuValues[parseInt(point.toString(), 10)].value);
            }
            specList.push({
                sku: specSkuIdAttr.sort().join(this.linkLine),
                rows: rowData,
                form: {price: 0, market_price: 0, stock: 0, series_number: '', weight: 0}
            });
        }
        // 合并旧sku数据
        if (this.specItems.length > 0 && specList.length > 0) {
            for (const item of specList) {
                const overlap = this.specItems.filter(val => {
                    return val.sku === item.sku;
                });
                if (overlap.length > 0) {
                    item.form = overlap[0].form;
                }
            }
        }
        this.radioItems = attrList;
        this.specItems = specList;
    }

    private formatAttr() {
        this.attrItems = this.attrItems.map(item => {
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
        this.formatProduct();
    }

    private formatProduct() {
        if (this.productItems.length < 1) {
            return;
        }
        const data: {
            [key: string]: IProduct
        } = {};
        for (const item of this.productItems) {
            if (!item.attributes) {
                continue;
            }
            const sku = this.converterSku(item.attributes.split(this.linkLine));
            if (sku) {
                data[sku] = item;
            }
        }
        this.buildAttrList();
        if (this.specItems.length < 1) {
            return;
        }
        for (const item of this.specItems) {
            if (Object.prototype.hasOwnProperty.call(data, item.sku)) {
                item.form = data[item.sku];
            }
        }
    }

    private converterSku(attrs: string[]): string {
        const args: string[] = [];
        for (const item of this.attrItems) {
            if (item.type !== 1) {
                continue;
            }
            for (const attr of item.attr_items) {
                if (attr.id && attrs.indexOf(attr.id.toString()) > 0) {
                    attr.checked = true;
                    args.push(attr.value);
                }
            }
        }
        return args.join(this.linkLine);
    }
}
