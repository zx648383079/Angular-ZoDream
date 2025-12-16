import { Component, computed, input, model} from '@angular/core';
import { animationFuncOptions, animationIterationCountOptions, animationLabelDelayOptions, animationLabelDurationOptions, animationLabelOptions } from '../../model';
import { PropertyUtil } from '../../util';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-editor-animation-input',
    templateUrl: './animation-input.component.html',
    styleUrls: ['./animation-input.component.scss'],
})
export class EditorAnimationInputComponent implements FormValueControl<any> {

    public items = animationLabelOptions;
    public delayItems = animationLabelDelayOptions;
    public durationItems = animationLabelDurationOptions;
    public loopItems = animationIterationCountOptions;
    public funcItems = animationFuncOptions;

    public readonly disabled = input<boolean>(false);
    public readonly value = model<any>({
        name: '',
        duration: '',
        func: 'linear',
        delay: '',
        loop: '',
    });

    public readonly boxStyle = computed(() => PropertyUtil.animation(this.value()));

    public onValueChange(e: Event, key: string) {
        this.value.update(v => {
            v[key] = (e.target as HTMLSelectElement).value;
            return v;
        });
    }
}
