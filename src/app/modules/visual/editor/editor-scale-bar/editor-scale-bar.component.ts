import { Component, inject, input, model } from '@angular/core';
import { checkRange } from '../../../../theme/utils';
import { EditorService } from '../editor.service';

@Component({
    standalone: false,
    selector: 'app-editor-scale-bar',
    templateUrl: './editor-scale-bar.component.html',
    styleUrls: ['./editor-scale-bar.component.scss']
})
export class EditorScaleBarComponent {
    private readonly service = inject(EditorService);


    public readonly orientation = input(false);
    public readonly min = input(30);
    public readonly max = input(300);
    public readonly value = model(100);
    public readonly step = input(10);

    constructor() {
        this.service.shellSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.value.set(res.scale);
        });
    }

    public get innerStyle() {
        const val = this.value() - this.min();
        const len = this.max() - this.min();
        const x = val * 100 / len;
        if (this.orientation()) {
            return {
                left: x + '%',
            };
        }
        return {
            top: x + '%',
        };
    }

    public tapMinus() {
        this.output(this.value() - this.step());
    }

    public tapPlus() {
        this.output(this.value() + this.step());
    }

    private output(val: number) {
        val = checkRange(val, this.min(), this.max());
        if (val == this.value()) {
            return;
        }
        this.value.set(val);
    }
}
