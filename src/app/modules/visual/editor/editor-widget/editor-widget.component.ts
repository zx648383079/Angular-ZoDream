import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EditorService } from '../editor.service';
import { Widget } from '../model';
import { boundFromScale, elementBound } from '../util';

@Component({
  selector: 'app-editor-widget',
  templateUrl: './editor-widget.component.html',
  styleUrls: ['./editor-widget.component.scss']
})
export class EditorWidgetComponent implements OnChanges, AfterViewInit {

    @Input() public value: Widget;
    private isBooted = false;

    constructor(
        private service: EditorService,
        private elementRef: ElementRef<HTMLDivElement>
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value.currentValue) {
            this.value.propertyChange$.subscribe(() => {
                if (!this.isBooted) {
                    return;
                }
                const eleBound = this.service.workspace.getPosition(elementBound(this.elementRef));
                const bound = boundFromScale(eleBound, this.service.shellSize$.value.scale, 100);
                this.value.actualBound = bound;
            });
        }
    }


    ngAfterViewInit(): void {
        const eleBound = this.service.workspace.getPosition(elementBound(this.elementRef));
        const bound = boundFromScale(eleBound, this.service.shellSize$.value.scale, 100);
        this.value.actualBound = bound;
        this.value.size = bound;
        this.isBooted = true;
    }

    public tapWidget() {

    }

    public moveWidget(event: MouseEvent) {
        if (event.button > 0) {
            return;
        }
        event.stopPropagation();
        const items = event.ctrlKey ? this.service.selectionChanged$.value : [];
        items.push(this.value);
        this.service.selectionChanged$.next(items);
    }

    public onMouseEnter() {

    }

    public onMouseLeave() {
        
    }

}
