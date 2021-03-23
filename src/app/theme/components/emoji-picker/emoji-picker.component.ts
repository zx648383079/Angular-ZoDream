import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { IEmoji, IEmojiCategory } from '../../models/forum';
import { IData } from '../../models/page';
import { hasElementByClass } from '../../utils';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent {

    @Input() public url = 'forum/emoji';
    @Output() public tapped = new EventEmitter<IEmoji>();
    public items: IEmojiCategory[] = [];
    public navIndex = 0;
    public panelVisible = false;
    private booted = false;

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.emoji-picker') && !hasElementByClass(event.path, 'emoji-picker_container')) {
            this.panelVisible = false;
        }
    }

    constructor(
        private http: HttpClient,
        private elementRef: ElementRef<HTMLDivElement>
    ) { }

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
        this.http.get<IData<IEmojiCategory>>(this.url).subscribe(res => {
            this.items = res.data;
        });
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
