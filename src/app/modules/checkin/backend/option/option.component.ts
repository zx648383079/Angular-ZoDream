import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { eachObject } from '../../../../theme/utils';
import { CheckinService } from '../checkin.service';

interface IPlusItem {
    day: number;
    plus: number;
}

@Component({
    standalone: false,
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
    private readonly service = inject(CheckinService);
    private readonly toastrService = inject(DialogService);


    public data: any = {
        basic: 0,
        loop: 0,
    };

    public plusItems: IPlusItem[] = [];

    ngOnInit() {
        this.service.option().subscribe(res => {
            this.data = res;
            if (res.plus) {
                this.plusItems = [];
                eachObject(res.plus, (v, k) => {
                    this.plusItems.push({
                        day: k as number,
                        plus: v
                    });
                });
            }
            if (this.plusItems.length < 1) {
                this.tapAddItem();
            }
        });
    }

    public tapSubmit() {
        const data = {...this.data};
        data.plus = {};
        for (const item of this.plusItems) {
            if (item.day < 1 || item.plus < 1) {
                continue;
            }
            data.plus[item.day] = item.plus;
        }
        this.service.optionSave(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapAddItem() {
        this.plusItems.push({
            day: 0,
            plus: 1,
        });
    }

    public tapRemoveItem(i: number) {
        this.plusItems.splice(i, 1);
    }
}
