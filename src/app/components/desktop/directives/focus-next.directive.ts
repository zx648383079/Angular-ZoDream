import { Directive, ElementRef, HostListener, OnDestroy, OnInit, inject, input } from '@angular/core';


@Directive({
    standalone: false,
    selector: '[appFocusNext]'
})
export class FocusNextDirective implements OnInit, OnDestroy {
    private elementRef = inject(ElementRef);


    static InputItems: FocusNextDirective[] = [];

    /**
     * 分组
     */
    public readonly appFocusNext = input<any>(0);
    /**
     * 排序，越大越往后
     */
    public readonly order = input(0);

    @HostListener('keydown', ['$event'])
    public onKeydown(e: KeyboardEvent) {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        FocusNextDirective.FocusNext(this);
    }
    

    ngOnInit(): void {
        FocusNextDirective.Add(this);
    }

    ngOnDestroy(): void {
        FocusNextDirective.Remove(this);
    }

    /**
     * 移动焦点到当前项
     * @returns 
     */
    public focus() {
        if (!this.elementRef.nativeElement) {
            return;
        }
        const element = this.elementRef.nativeElement;
        const tagName = element.tagName.toLocaleLowerCase();
        if (tagName === 'textarea' || tagName === 'select') {
            (element as HTMLTextAreaElement).focus();
            return;
        }
        if (tagName === 'input') {
            const type = (element as HTMLInputElement).type.toLocaleLowerCase();
            console.log(type);
            
            if (type === 'button' || type === 'submit' || type === 'reset') {
                element.click();
                return;
            }
            (element as HTMLInputElement).focus();
            return;
        }
        if (tagName === 'form') {
            (element as HTMLFormElement).submit();
            return;
        }
        element.click();
    }

    /**
     * 注册到可操作项
     * @param item 
     * @returns 
     */
    private static Add(item: FocusNextDirective) {
        if (this.InputItems.indexOf(item) >= 0) {
            return;
        }
        this.InputItems.push(item);
    }

    /**
     * 移除当前
     * @param item 
     */
    private static Remove(item: FocusNextDirective) {
        const i = this.InputItems.indexOf(item);
        if (i >= 0) {
            this.InputItems.splice(i, 1);
        }
    }

    /**
     * 根据当前触发，移动焦点到下一项
     * @param source 
     */
    private static FocusNext(source: FocusNextDirective) {
        let found = false;
        let next: FocusNextDirective = undefined;
        for (const item of this.InputItems) {
            if (item.appFocusNext() !== source.appFocusNext()) {
                continue;
            }
            if (item === source) {
                found = true;
                continue;
            }
            const order = item.order();
            if (item.order() < source.order() || (!found && order === order)) {
                continue;
            }
            if (order === order && found) {
                next = item;
                break;
            }
            if (!next) {
                next = item;
                continue;
            }
            if (order > order) {
                next = item;
                continue;
            }
        }
        next?.focus();
    }
}
