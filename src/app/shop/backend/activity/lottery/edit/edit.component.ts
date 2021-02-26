import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IActivity, ILotteryConfigure } from '../../../../../theme/models/shop';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditLotteryComponent implements OnInit {

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
            btn_text: 0,
            over_text: 0
        }),
        items: this.fb.array([])
    });

    public data: IActivity<ILotteryConfigure>;

    constructor(
        private service: ActivityService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) { }

    get scopeType() {
        const val = this.form.get('scope_type').value;
        return typeof val === 'number' ? val : parseInt(val, 10);
    }

    get giftItems() {
        return this.form.get('items') as FormArray;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.lottery(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    thumb: res.thumb,
                    description: res.description,
                    scope_type: res.scope_type,
                    start_at: res.start_at,
                    end_at: res.end_at,
                    configure: this.fb.group(res.configure),
                });
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
        const data: IActivity<any> = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.lotterySave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    public tapRemoveItem(i: number) {
        this.giftItems.removeAt(i);
    }

    public tapAddItem() {
        this.giftItems.push(this.fb.group({
            name: '',
            chance: 0,
            color: '',
        }));
    }
}
