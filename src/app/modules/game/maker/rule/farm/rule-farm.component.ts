import { Component, OnInit, inject, signal } from '@angular/core';
import { GameMakerService } from '../../game-maker.service';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IGameFarmPlot } from '../../../model';
import { parseNumber } from '../../../../../theme/utils';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-maker-rule-farm',
    templateUrl: './rule-farm.component.html',
    styleUrls: ['./rule-farm.component.scss']
})
export class RuleFarmComponent implements OnInit {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public items: IGameFarmPlot[] = [];
    public readonly queries = form(signal({
        project: 0
    }));
    public readonly editForm = form(signal<IGameFarmPlot>({
        id: 0,
        index: 0,
        grade: 0,
        grade_alias: '',
        price: 0,
        time_scale: 0,
        yield_scale: 0,
        upgrade_rules: [],
    }));

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project().value.set(parseNumber(params.game));
        });
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: IGameFarmPlot) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.index = item?.index ?? 0;
            v.grade = item?.grade ?? 0;
            v.grade_alias = item?.grade_alias ?? '';
            v.price = item?.price ?? 0;
            v.time_scale = item?.time_scale ?? 0;
            v.yield_scale = item?.yield_scale ?? 0;
            v.upgrade_rules = item?.upgrade_rules ?? [];
            return v;
        });
        modal.open(() => {
            if (!this.editForm.upgrade_rules) {
                this.editForm.upgrade_rules().value.set([]);
            }
            if (!item) {
                this.items.push(this.editForm().value());
            }
            // this.service.projectSave({...this.editForm}).subscribe({
            //     next: _ => {
            //         this.toastrService.success($localize `Save Successfully`);
            //         this.tapRefresh();
            //     },
            //     error: err => {
            //         this.toastrService.error(err);
            //     }
            // });
        }, () => this.editForm().valid());
    }

    public tapRefresh() {
        
    }
}
