import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICourse, IQuestionMaterial } from '../../../model';

@Component({
    selector: 'app-material-form',
    templateUrl: './material-form.component.html',
    styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent {

    @Input() public courseItems: ICourse[] = [];
    @Input() public value: IQuestionMaterial = {} as any;
    @Output() public valueChange = new EventEmitter<IQuestionMaterial>();

    public typeItems = ['文本', '音频', '视频'];

    constructor() { }

    public onValueChange() {
        this.valueChange.emit(this.value);
    }
}
