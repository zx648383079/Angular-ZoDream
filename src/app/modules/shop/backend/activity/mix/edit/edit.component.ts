import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { DialogAnimation } from '../../../../../../theme/constants/dialog-animation';
import { IActivity, IGoods, IGoodsResult, IMixConfigure, IMixGoods } from '../../../../model';
import { ActivityService } from '../../activity.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    animations: [
        DialogAnimation
    ]
})
export class EditMixComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope_type: [0],
        start_at: [''],
        end_at: [],
        configure: this.fb.group({
            price: 0
        }),
    });

    public data: IActivity<IMixConfigure>;
    public dialogOpen = false;
    public goodsItems: IMixGoods[] = [];

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }


    public get configure() {
        return this.form.get('configure');
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.mix(params.id).subscribe(res => {
                this.data = res;
                this.goodsItems = res.configure.goods;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at,
                });
                this.configure.get('price').setValue(res.configure.price);
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IActivity<any> = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        let total = 0;
        data.configure.goods = this.goodsItems.map(i => {
            total += i.amount * i.price;
            return {
                goods_id: i.goods_id,
                amount: i.amount,
                price: i.price
            };
        });
        if (data.configure.goods.length < 2) {
            this.toastrService.warning('组合中商品至少两种');
            return;
        }
        if (parseFloat(data.configure.price) !== total) {
            this.toastrService.warning('组合中商品总价[' + total +']与组合价不一致');
            return;
        }
        this.service.mixSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    public tapRemoveItem(i: number) {
        this.goodsItems.splice(i, 1);
    }

    public tapAddItem() {
        this.dialogOpen = true;
    }

    public onGoodsSelected(event: IGoodsResult|IGoodsResult[]) {
        this.dialogOpen = false;
        if (!(event instanceof Array)) {
            event = [event];
        }
        if (event.length < 1) {
            return;
        }
        for (const item of event) {
            if (this.indexOf(item.id) >= 0) {
                continue;
            }
            this.goodsItems.push({
                goods_id: item.id,
                goods: item as any,
                price: item.price,
                amount: 1,
            });
        }
    }

    private indexOf(goodsId: number): number {
        for (let i = this.goodsItems.length - 1; i >= 0; i--) {
            if (this.goodsItems[i].goods_id === goodsId) {
                return i;
            }
        }
        return -1;
    }
}
