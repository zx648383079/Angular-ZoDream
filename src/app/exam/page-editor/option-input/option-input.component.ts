import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogEvent } from '../../../dialog';
import { IQuestionOption } from '../../model';

@Component({
  selector: 'app-option-input',
  templateUrl: './option-input.component.html',
  styleUrls: ['./option-input.component.scss']
})
export class OptionInputComponent {
    @Input() public value: IQuestionOption[] = [];
    @Input() public editable = true;
    @Output() public valueChange = new EventEmitter<IQuestionOption[]>();
    public optionData: IQuestionOption = {
        type: 0,
        content: '',
        checked: false,
    } as any;
    public optionTypeItems = ['文字', '图片'];

    constructor() { }

    public tapSelected(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.editable) {
            return;
        }
        const item = this.value[i];
        item.checked = !item.checked;
        this.onValueChange();
    }

    public tapEditOption(modal: DialogEvent, i = -1) {
        if (!this.editable) {
            return;
        }
        this.optionData = i >= 0 ? {...this.value[i], type: this.value[i].type || 0} : {
            type: 0,
            content: this.getNewOptionLabel(),
            is_right: false,
            checked: false,
        } as any;
        modal.open(() => {
            if (i >= 0) {
                this.value[i] = {...this.optionData};
            } else {
                this.value.push({...this.optionData});
            }
            this.onValueChange();
        });
    }

    private getNewOptionLabel(): string {
        let label = '选项';
        switch (this.value.length) {
            case 0:
                return '对';
            case 1:
                return this.value[0].content === '对' ? '错' : '对';
            default:
                break;
        }
        return label;
    }

    public tapAddOption() {
        if (!this.editable) {
            return;
        }
        this.value.push({
            content: this.getNewOptionLabel(),
            checked: false,
            is_right: false,
        });
        this.onValueChange();
    }

    public tapRemoveOption(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.editable) {
            return;
        }
        this.value.splice(i, 1);
        this.onValueChange();
    }

    private onValueChange() {
        this.valueChange.emit(this.value);
    }
}
