import { afterNextRender, Component, effect, ElementRef, inject, input } from '@angular/core';
import { EditorService } from '../editor.service';
import { Widget } from '../model';
import { boundFromScale, elementBound } from '../util';

@Component({
    standalone: false,
    selector: 'app-editor-widget',
    templateUrl: './editor-widget.component.html',
    styleUrls: ['./editor-widget.component.scss']
})
export class EditorWidgetComponent {
    private readonly service = inject(EditorService);
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    public readonly value = input<Widget>(undefined);
    private isBooted = false;

    constructor() {
        effect(() => {
            this.value().propertyChange$.subscribe(() => {
                if (!this.isBooted) {
                    return;
                }
                const eleBound = this.service.workspace.getPosition(elementBound(this.elementRef));
                const bound = boundFromScale(eleBound, this.service.shellSize$.value.scale, 100);
                this.value().actualBound = bound;
            });
        });
        afterNextRender({
            write: () => {
                const eleBound = this.service.workspace.getPosition(elementBound(this.elementRef));
                const bound = boundFromScale(eleBound, this.service.shellSize$.value.scale, 100);
                const value = this.value();
                value.actualBound = bound;
                value.size = bound;
                this.isBooted = true;
            }
        });
    }

    public tapWidget() {

    }

    public moveWidget(event: MouseEvent) {
        if (event.button > 0) {
            return;
        }
        event.stopPropagation();
        const items = event.ctrlKey ? this.service.selectionChanged$.value : [];
        items.push(this.value());
        this.service.selectionChanged$.next(items);
    }

    public onMouseEnter() {

    }

    public onMouseLeave() {
        
    }

}
