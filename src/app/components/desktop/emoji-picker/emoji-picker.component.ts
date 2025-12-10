import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, input, output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEmoji, IEmojiCategory } from '../../../theme/models/seo';
import { hasElementByClass } from '../../../theme/utils/doc';
import { IData } from '../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-emoji-picker',
    templateUrl: './emoji-picker.component.html',
    styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent {
    private http = inject(HttpClient);
    private elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    static cacheMaps: {[url: string]: IEmojiCategory[]} = {};

    public readonly url = input('seo/emoji');
    public readonly tapped = output<IEmoji>();
    public items: IEmojiCategory[] = [];
    public navIndex = 0;
    public panelVisible = false;
    private booted = false;

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.emoji-picker') && !hasElementByClass(event.path, 'emoji-picker_container')) {
            this.panelVisible = false;
        }
    }

    get panelStyle() {
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        const diff = window.innerWidth - bound.left - 340;
        const bottom = window.innerHeight - bound.bottom - 320;
        return {
            'margin-left': (diff >= 0 ? 0 : diff) + 'px',
            'margin-top': (bottom >= 0 ? 0 : -310) + 'px',
        };
    }

    public get navItems() {
        return this.items.map(i => {
            return {
                name: i.name
            };
        });
    }

    public get navTitle(): string {
        if (this.navIndex >= this.items.length) {
            return '';
        }
        return this.items[this.navIndex].name;
    }

    public get fiterItems(): IEmoji[] {
        if (this.navIndex >= this.items.length) {
            return [];
        }
        return this.items[this.navIndex].items;
    }

    private load() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.getOrSet(this.url()).subscribe(res => {
            this.items = res;
        });
    }

    private getOrSet(url: string): Observable<IEmojiCategory[]> {
        if (Object.prototype.hasOwnProperty.call(EmojiPickerComponent.cacheMaps, url)) {
            return of(EmojiPickerComponent.cacheMaps[url]);
        }
        return this.http.get<IData<IEmojiCategory>>(url).pipe(map(res => {
            return EmojiPickerComponent.cacheMaps[url] = res.data;
        }));
    }

    public tapButton() {
        this.load();
        this.panelVisible = true;
    }

    public tapItem(item: any) {
        this.panelVisible = false;
        this.tapped.emit(item);
    }

}
