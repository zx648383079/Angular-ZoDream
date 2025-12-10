import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IScoreSubtotal } from '../../../../theme/models/seo';
import { ResourceService } from '../../resource.service';

@Component({
    standalone: false,
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnChanges {
    service = inject(ResourceService);
    private toastrService = inject(DialogService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public subtotal: IScoreSubtotal;
    public isLoading = false;
    private booted = 0;
    public scoreData = {
        score: 10,
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.itemId() > 0 && this.booted !== this.itemId()) {
            this.boot();
        }
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapGrade(e?: ButtonEvent) {
        if (this.scoreData.score < 1 || this.scoreData.score > 10) {
            this.toastrService.warning($localize `Please input score`);
            return;
        }
        e?.enter();
        this.service.scoreGrade({...this.scoreData, id: this.itemId()}).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Score successfull`);
                this.scoreData.score = 10;
            }, 
            error: err => {
                e?.reset();
                this.scoreData.score = 10;
                this.toastrService.warning(err);
            }
        })
    }

    public onScoreChange() {
        this.tapGrade();
    }

    public tapRefresh() {
        this.service.scoreSubtotal({
            id: this.itemId()
        }).subscribe(res => {
            this.subtotal = res;
        });
    }


}
