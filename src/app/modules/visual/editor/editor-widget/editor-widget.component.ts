import { Component, ElementRef, Input } from '@angular/core';
import { EditorService } from '../editor.service';
import { Widget } from '../model';
import { elementBound } from '../util';

@Component({
  selector: 'app-editor-widget',
  templateUrl: './editor-widget.component.html',
  styleUrls: ['./editor-widget.component.scss']
})
export class EditorWidgetComponent {

    @Input() public value: Widget;

    constructor(
        private service: EditorService,
        private elementRef: ElementRef<HTMLDivElement>
    ) {
    }

    ngAfterViewInit(): void {
        const bound = this.service.workspace.getPosition(elementBound(this.elementRef));
        this.value.actualBound = bound;
        this.value.size = bound;
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
