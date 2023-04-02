import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonEvent } from '../../../components/form';
import { ThemeService } from '../../services';

@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnChanges, ButtonEvent {

    @Input() public title = '';
    @Input() public min = false;
    @Input() public disabled = false;
    @Input() public loading = false;
    @Output() public submited = new EventEmitter<ButtonEvent>();

    constructor(
        private themeService: ThemeService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.title) {
            this.themeService.setTitle(changes.title.currentValue);
        }
    }

    public tapSubmit() {
        if (this.disabled || this.loading) {
            return;
        }
        this.submited.emit(this);
    }

    /**
     * 开始执行加载
     */
    public enter() {
        this.loading = true;
    }

    /**
     * 停止执行
     */
    public reset() {
        this.loading = false;
    }

}
