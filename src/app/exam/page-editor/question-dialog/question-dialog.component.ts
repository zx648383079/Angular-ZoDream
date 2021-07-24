import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomDialogEvent } from '../../../dialog';
import { DialogAnimation } from '../../../theme/constants';
import { IQuestion } from '../../model';

@Component({
    selector: 'app-question-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class QuestionDialogComponent implements CustomDialogEvent {

    public visible = false;
    public typeItems = ['单选题', '多选题', '判断题', '简答题', '填空题'];
    public typeOpen = false;
    public analysisOpen = false;
    @Input() public value: IQuestion = {} as any;
    public optionItems: any[] = [
        {content: '对', checked: false},
        {content: '错', checked: false}
    ];
    @Output() public valueChange = new EventEmitter<IQuestion>();
    private actionFn: any;

    constructor() { }

    public tapType(i: number) {
        this.typeOpen = false;
        this.value.type = i;
    }

    public close(result?: any) {
        if (!result) {
            this.visible = false;
            return;
        }
        this.valueChange.emit(this.value);
        if (!this.actionFn) {
            this.visible = false;
            return;
        }
        this.actionFn();
    }

    public open<T>(data: T, confirm: (data: T) => void, check?: (data: T) => boolean) {
        this.value = data as any;
        this.visible = true;
        this.actionFn = () => {
            if (check && !check(this.value as any)) {
                return;
            }
            confirm(this.value as any);
            this.visible = false;
        };
    }
}
