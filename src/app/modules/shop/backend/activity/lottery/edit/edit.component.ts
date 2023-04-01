import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { IActivity, IGoods, ILotteryConfigure, ILotteryGift } from '../../../../model';
import { SearchDialogComponent } from '../../../goods/search-dialog/search-dialog.component';
import { ActivityService } from '../../activity.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditLotteryComponent implements OnInit {

    @ViewChild(SearchDialogComponent)
    private modal: SearchDialogComponent;

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        description: [''],
        scope: [[], Validators.required],
        scope_type: [0],
        start_at: [''],
        end_at: [],
        configure: this.fb.group({
            time_price: 0,
            buy_times: 0,
            start_times: 0,
            btn_text: '',
            over_text: ''
        }),
    });

    public data: IActivity<ILotteryConfigure>;
    public giftItems: ILotteryGift[] = [
        {
            name: '未中奖',
            goods_id: 0,
            chance: 0,
            color: '',
        }
    ];

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

    get scopeType() {
        const val = this.form.get('scope_type').value;
        return typeof val === 'number' ? val : parseInt(val, 10);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.lottery(params.id).subscribe(res => {
                this.data = res;
                this.giftItems = res.configure.items;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type,
                    start_at: res.start_at as string,
                    end_at: res.end_at,
                });
                this.form.get('configure').patchValue(res.configure);
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
        data.configure.items = this.giftItems.map(i => {
            return {
                goods_id: i.goods_id,
                name: i.name,
                chance: i.chance,
                color: i.color,
            };
        });
        if (data.configure.goods.length < 2 || data.configure.goods.length > 8) {
            this.toastrService.warning('组合中商品至少两种,最多8种');
            return;
        }
        this.service.lotterySave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public tapRemoveItem(i: number) {
        this.giftItems.splice(i, 1);
    }

    public tapAddItem() {
        this.modal.open((event: IGoods[]) => {
            if (event.length < 1) {
                return;
            }
            for (const item of event) {
                if (this.indexOf(item.id) >= 0) {
                    continue;
                }
                this.giftItems.push({
                    goods_id: item.id,
                    goods: item,
                    name: '',
                    chance: 0,
                    color: '',
                });
            }
        });
    }

    private indexOf(goodsId: number): number {
        for (let i = this.giftItems.length - 1; i >= 0; i--) {
            if (this.giftItems[i].goods_id === goodsId) {
                return i;
            }
        }
        return -1;
    }



    public tapUpItem(i: number) {
        if (i < 1) {
            return;
        }
        this.giftItems[i] = this.giftItems.splice(i - 1, 1, this.giftItems[i])[0];
    }

    public tapDownItem(i: number) {
        if (i >= this.giftItems.length - 1) {
            return;
        }
        this.giftItems[i] = this.giftItems.splice(i + 1, 1, this.giftItems[i])[0];
    }
}
