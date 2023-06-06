import { Component, OnInit } from '@angular/core';
import { GameMakerService } from '../../game-maker.service';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IGameFarmPlot } from '../../../model';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    selector: 'app-maker-rule-farm',
    templateUrl: './rule-farm.component.html',
    styleUrls: ['./rule-farm.component.scss']
})
export class RuleFarmComponent implements OnInit {

    public items: IGameFarmPlot[] = [];
    private queries = {
        project: 0
    };
    public editData: IGameFarmPlot = {} as any;

    constructor(
        private service: GameMakerService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project = parseNumber(params.game);
        });
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: IGameFarmPlot) {
        this.editData = item ? {...item} : {} as any;
        modal.open(() => {
            if (!this.editData.upgrade_rules) {
                this.editData.upgrade_rules = [];
            }
            if (!item) {
                this.items.push(this.editData);
            }
            // this.service.projectSave({...this.editData}).subscribe({
            //     next: _ => {
            //         this.toastrService.success($localize `Save Successfully`);
            //         this.tapRefresh();
            //     },
            //     error: err => {
            //         this.toastrService.error(err);
            //     }
            // });
        });
    }

    public tapRefresh() {
        
    }
}
