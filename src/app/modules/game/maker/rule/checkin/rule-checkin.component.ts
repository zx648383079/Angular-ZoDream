import { Component, OnInit, inject, signal } from '@angular/core';
import { GameMakerService } from '../../game-maker.service';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { form } from '@angular/forms/signals';

interface IPlusItem {
    day: number;
    plus: number;
}

@Component({
    standalone: false,
    selector: 'app-maker-rule-checkin',
    templateUrl: './rule-checkin.component.html',
    styleUrls: ['./rule-checkin.component.scss']
})
export class RuleCheckinComponent implements OnInit {
    private readonly service = inject(GameMakerService);
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
        // this.service.option().subscribe(res => {
        //     this.data = res;
        //     if (res.plus) {
        //         this.plusItems = [];
        //         eachObject(res.plus, (v, k) => {
        //             this.plusItems.push({
        //                 day: k as number,
        //                 plus: v
        //             });
        //         });
        //     }
        //     if (this.plusItems.length < 1) {
        //         this.tapAddItem();
        //     }
        // });
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
        // this.service.optionSave(data).subscribe({
        //     next: _ => {
        //         this.toastrService.success($localize `Save Successfully`);
        //     },
        //     error: err => {
        //         this.toastrService.error(err);
        //     }
        // });
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
