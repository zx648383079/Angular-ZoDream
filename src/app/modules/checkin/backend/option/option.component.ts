import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { eachObject } from '../../../../theme/utils';
import { CheckinService } from '../checkin.service';
import { form } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../components/form';

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


    public readonly dataForm = form(signal({
        basic: 0,
        loop: 0,
        items: <IPlusItem[]>[{
            day: 0,
            plus: 1
        }],
    }));
    ngOnInit() {
        this.service.option().subscribe(res => {
            const items = [];
            eachObject(res.plus, (v, k) => {
                items.push({
                    day: k as number,
                    plus: v
                });
            });
            if (items.length < 1) {
                items.push({
                    day: 0,
                    plus: 1
                })
            }
            this.dataForm().value.set({
                basic: res.basic,
                loop: res.loop,
                items
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        const data = this.dataForm().value() as any;
        data.plus = {};
        for (const item of data.items) {
            if (item.day < 1 || item.plus < 1) {
                continue;
            }
            data.plus[item.day] = item.plus;
        }
        e?.enter();
        this.service.optionSave({...data, items: undefined}).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public tapAddItem() {
        this.dataForm.items().value.update(v => {
            v.push({
                day: 0,
                plus: 1,
            });
            return [...v];
        });
    }

    public tapRemoveItem(i: number) {
        this.dataForm.items().value.update(v => {
            v.splice(i, 1);
            return [...v];
        });
    }
}
