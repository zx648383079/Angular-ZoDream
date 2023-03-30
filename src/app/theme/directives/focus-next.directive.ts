import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';


@Directive({
    selector: '[appFocusNext]'
})
export class FocusNextDirective implements OnInit, OnDestroy {

    static InputItems: FocusNextDirective[] = [];

    /**
     * 分组
     */
    @Input() public appFocusNext: any = 0;
    /**
     * 排序，越大越往后
     */
    @Input() public order = 0;

    constructor(
        private elementRef: ElementRef,
    ) { }

    @HostListener('keydown', ['$event'])
    onKeydown(e: KeyboardEvent) {
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
            if (item.appFocusNext !== source.appFocusNext) {
                continue;
            }
            if (item === source) {
                found = true;
                continue;
            }
            if (item.order < source.order || (!found && item.order === source.order)) {
                continue;
            }
            if (item.order === source.order && found) {
                next = item;
                break;
            }
            if (!next) {
                next = item;
                continue;
            }
            if (next.order > item.order) {
                next = item;
                continue;
            }
        }
        next?.focus();
    }
}
