import { HttpClient } from '@angular/common/http';
import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEmoji, IEmojiCategory } from '../../../theme/models/seo';
import { isParentOf } from '../../../theme/utils/doc';
import { IData } from '../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-emoji-picker',
    templateUrl: './emoji-picker.component.html',
    styleUrls: ['./emoji-picker.component.scss'],
    host: {
        class: 'emoji-picker'
    }
})
export class EmojiPickerComponent {
    private readonly http = inject(HttpClient);
    private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);


    static cacheMaps: {[url: string]: IEmojiCategory[]} = {};

    public readonly url = input('seo/emoji');
    public readonly tapped = output<IEmoji>();
    public readonly items = signal<IEmojiCategory[]>([]);
    public readonly navIndex = signal(0);
    public readonly panelVisible = signal(false);
    private booted = false;

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: MouseEvent) {
        if (isParentOf(event.target as Node, this.elementRef.nativeElement) < 0) {
            this.panelVisible.set(false);
        }
    }

    public readonly panelStyle = computed(() => {
        const bound = this.elementRef.nativeElement.getBoundingClientRect();
        const diff = window.innerWidth - bound.left - 340;
        const bottom = window.innerHeight - bound.bottom - 320;
        return {
            'margin-left': (diff >= 0 ? 0 : diff) + 'px',
            'margin-top': (bottom >= 0 ? 0 : -310) + 'px',
        };
    });

    public readonly navItems = computed(() => {
        return this.items().map(i => {
            return {
                name: i.name
            };
        });
    });

    public readonly navTitle = computed(() => {
        if (this.navIndex() >= this.items().length) {
            return '';
        }
        return this.items()[this.navIndex()].name;
    });

    public readonly fiterItems = computed(() => {
        if (this.navIndex() >= this.items().length) {
            return [];
        }
        return this.items()[this.navIndex()].items;
    });

    private load() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.getOrSet(this.url()).subscribe(res => {
            this.items.set(res);
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
        this.panelVisible.set(true);
    }

    public tapItem(item: any) {
        this.panelVisible.set(false);
        this.tapped.emit(item);
    }

}
