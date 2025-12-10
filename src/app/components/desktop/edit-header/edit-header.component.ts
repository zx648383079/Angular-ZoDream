import { Component, OnChanges, SimpleChanges, inject, input, output } from '@angular/core';
import { ButtonEvent } from '../../../components/form';
import { ThemeService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-edit-header',
    templateUrl: './edit-header.component.html',
    styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnChanges, ButtonEvent {
    private themeService = inject(ThemeService);


    public readonly title = input('');
    public readonly min = input(false);
    public readonly disabled = input(false);
    public readonly loading = input(false);
    public readonly submited = output<ButtonEvent>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes.title) {
            this.themeService.titleChanged.next(changes.title.currentValue);
        }
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.disabled() || this.loading()) {
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
