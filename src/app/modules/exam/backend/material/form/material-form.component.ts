import { Component, input, output } from '@angular/core';
import { ICourse, IQuestionMaterial } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-material-form',
    templateUrl: './material-form.component.html',
    styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent {

    public readonly courseItems = input<ICourse[]>([]);
    public readonly value = input<IQuestionMaterial>({} as any);
    public readonly valueChange = output<IQuestionMaterial>();

    public typeItems = ['文本', '音频', '视频'];

    constructor() { }

    public onValueChange() {
        this.valueChange.emit(this.value());
    }
}
