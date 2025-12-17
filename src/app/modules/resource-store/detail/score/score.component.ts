import { Component, effect, inject, input, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IScoreSubtotal } from '../../../../theme/models/seo';
import { ResourceService } from '../../resource.service';
import { form, validate } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent {
    private readonly service = inject(ResourceService);
    private readonly toastrService = inject(DialogService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public subtotal: IScoreSubtotal;
    public isLoading = false;
    private booted = 0;
    public readonly scoreForm = form(signal({
        score: 10,
    }), schemaPath => {
        validate(schemaPath.score, ({value}) => {
            const val = value();
            if (val > 0 && val <= 10) {
                return null;
            }
            return {
                kind: 'range',
                message: $localize `Please input score`
            };
        });
    });

    constructor() {
        effect(() => {
            if (this.init() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapGrade(e?: ButtonEvent) {
        if (this.scoreForm().invalid()) {
            return;
        }
        e?.enter();
        this.service.scoreGrade({...this.scoreForm().value(), id: this.itemId()}).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Score successfull`);
                this.scoreForm.score().value.set(10);
            }, 
            error: err => {
                e?.reset();
                this.scoreForm.score().value.set(10);
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
