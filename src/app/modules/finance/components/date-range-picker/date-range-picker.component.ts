import { Component, computed, model, output, signal } from '@angular/core';
import { DateSource } from '../../../../components/form';
import { formatDate } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent {

    public readonly visible = signal(false);
    public readonly source = new DateSource('yyyy-mm-dd');
    public readonly tabIndex = signal(0);

    public readonly begin = model<string>(formatDate(new Date(), 'yyyy-mm-01'));
    public readonly end = model<string>();

    public readonly beginValue = signal('');
    public readonly endValue = signal('');

    public readonly valueChange = output<void>();
    
    public readonly selectedValue = computed(() => {
        return this.tabIndex() > 0 ? this.endValue() : this.beginValue();
    });

    public tapTab(index: number) {
        this.tabIndex.set(index);
    }

    public onValueChange(val: string) {
        if (this.tabIndex() > 0) {
            this.endValue.set(val);
        } else {
            this.beginValue.set(val);
        }
    }

    public open() {
        this.beginValue.set(this.begin());
        this.endValue.set(this.end());
        this.tapTab(0);
        this.visible.set(true);
    }

    public close(isOk = false) {
        this.visible.set(false);
        if (!isOk) {
            return;
        }
        this.begin.set(this.beginValue());
        this.end.set(this.endValue());
        this.valueChange.emit();
    }
}
