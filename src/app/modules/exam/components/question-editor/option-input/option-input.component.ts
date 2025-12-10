import { Component, input, output } from '@angular/core';
import { DialogEvent } from '../../../../../components/dialog';
import { IQuestionOption } from '../../../model';
import { intToABC } from '../../../util';

@Component({
    standalone: false,
  selector: 'app-option-input',
  templateUrl: './option-input.component.html',
  styleUrls: ['./option-input.component.scss']
})
export class OptionInputComponent {
    public readonly value = input<IQuestionOption[]>([]);
    public readonly editable = input(true);
    public readonly multiple = input(false);
    public readonly valueChange = output<IQuestionOption[]>();
    public optionData: IQuestionOption = {
        type: 0,
        content: '',
        is_right: false,
    } as any;
    public optionTypeItems = ['文字', '图片'];

    constructor() { }

    public tapSelected(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.editable()) {
            return;
        }
        const item = this.value()[i];
        item.is_right = !item.is_right;
        if (item.is_right && !this.multiple()) {
            this.value().forEach((v, j) => {
                if (i === j) {
                    return;
                }
                v.is_right = false;
            });
        }
        this.onValueChange();
    }

    public tapEditOption(modal: DialogEvent, i = -1) {
        if (!this.editable()) {
            return;
        }
        this.optionData = i >= 0 ? {...this.value()[i], type: this.value()[i].type || 0} : {
            type: 0,
            content: '',
            is_right: false,
        } as any;
        modal.openCustom(action => {
            if (typeof action === 'undefined') {
                return false;
            }
            if (!action) {
                return;
            }
            const value = this.value();
            if (i >= 0) {
                value[i] = {...this.optionData};
            } else {
                value.push({...this.optionData});
            }
            if (this.optionData.is_right && !this.multiple()) {
                value.forEach((v, j) => {
                    if (i < 0 && j === this.value().length - 1) {
                        return;
                    }
                    if (i === j) {
                        return;
                    }
                    v.is_right = false;
                });
            }
            this.onValueChange();
            if (action === 'next') {
                this.tapEditOption(modal, i >= value.length - 1 || i < 0 ? -1 : i + 1 );
                return false;
            }
        }, '编辑' + intToABC(i >= 0 ? i : this.value().length) + '选项');
    }

    private getNewOptionLabel(): string {
        let label = '选项';
        const value = this.value();
        switch (value.length) {
            case 0:
                return '对';
            case 1:
                return value[0].content === '对' ? '错' : '对';
            default:
                break;
        }
        return label;
    }

    public tapAddOption() {
        if (!this.editable()) {
            return;
        }
        this.value().push({
            content: this.getNewOptionLabel(),
            is_right: false,
        });
        this.onValueChange();
    }

    public tapRemoveOption(event: MouseEvent, i: number) {
        event.stopPropagation();
        if (!this.editable()) {
            return;
        }
        this.value().splice(i, 1);
        this.onValueChange();
    }

    private onValueChange() {
        this.valueChange.emit(this.value());
    }
}
