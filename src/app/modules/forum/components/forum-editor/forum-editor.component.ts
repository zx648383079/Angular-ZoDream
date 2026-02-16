import { Component, ElementRef, inject, input, viewChild, model, computed, afterNextRender, signal } from '@angular/core';
import { DialogBoxComponent } from '../../../../components/dialog';
import { IEmoji } from '../../../../theme/models/seo';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { wordLength } from '../../../../theme/utils';
import { FormValueControl } from '@angular/forms/signals';

interface IRange {
    start: number;
    end: number;
}

@Component({
    standalone: false,
    selector: 'app-forum-editor',
    templateUrl: './forum-editor.component.html',
    styleUrls: ['./forum-editor.component.scss'],
})
export class ForumEditorComponent implements FormValueControl<string> {
    private readonly uploadService = inject(FileUploadService);


    private readonly areaElement = viewChild<ElementRef<HTMLTextAreaElement>>('editorArea');
    private readonly modal = viewChild(DialogBoxComponent);
    public readonly height = input(200);
    public readonly placeholder = input('');

    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    private range: IRange;
    public readonly dialogData = signal({
        mode: 0,
        price: '',
        lang: '',
        card: 0,
        link: '',
        content: '',
        items: [{content: ''}]
    });
    public readonly uploadKey = this.uploadService.uniqueId();

    public readonly size = computed(() => {
        return wordLength(this.value());
    });

    public readonly areaStyle = computed(() => {
        return {
            height: this.height() + 'px',
        };
    });

    private get area(): HTMLTextAreaElement {
        return this.areaElement().nativeElement as HTMLTextAreaElement;
    }

    constructor() {
        afterNextRender({
            write: () => {
                this.bindAreaEvent();
            }
        });
    }

    private bindAreaEvent() {
        this.area.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.saveRange();
                this.insertTab();
            }
        });
        this.area.addEventListener('blur', e => {
            this.saveRange();
        });
    }

    private checkRange() {
        if (!this.range) {
            this.range = {
                start: this.area.value.length,
                end: this.area.value.length
            };
        }
    }

    private saveRange() {
        this.range = {
            start: this.area.selectionStart,
            end: this.area.selectionEnd
        };
    }

    public tapEmoji(item: IEmoji) {
        const content = item.type > 0 ? item.content : '[' + item.name + ']';
        this.insert(content, content.length)
    }

    public tapTool(name: string) {
        switch (name) {
            case 'code':
                return this.openDialog({
                    title: $localize `Insert code`,
                    mode: 1,
                    lang: 'js', content: ''}, data => {
                    this.insert('<code lang="' + data.lang +'">' + data.content +'</code>');
                }, data => {
                    return data.lang.length > 0 && data.content.length > 0;
                });
            case 'hide':
                return this.openDialog({
                    title: $localize `Insert hidden content`, 
                    mode: 2, 
                    price: 0, content: ''}, data => {
                    this.insert('<hide price="' + data.price +'">' + data.content +'</hide>');
                }, data => {
                    return data.content.length > 0;
                });
            case 'link':
                return this.openDialog({title: $localize `Insert link`, mode: 3, link: '', content: '', card: false}, data => {
                    const card = data.card ? ' card="true"' : ''
                    this.insert('<a href="' + data.link +'"' + card + '>' + data.content +'</a>');
                }, data => {
                    return data.link.length > 0 && data.content.length > 0;
                });
            case 'vote':
                return this.openDialog({title: $localize `Insert Vote`, mode: 4, content: '', items: [{content: ''}, {content: ''},]}, data => {
                    this.insert('<vote>\n' + data.content +'\n\t' + data.items.filter(i => i.content.trim().length > 0).map(i => '<v>' + i.content + '</v>').join('\n\t') +'\n</vote>');
                }, data => {
                    return data.content.length > 0 && data.items.filter(i => i.content.trim().length > 0).length > 1;
                });
            case 'clear':
                return this.clear();
            case 'page':
                return this.insert('<page/>');
            default:
                break;
        }
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImages(files).subscribe(res => {
            res.forEach(i => {
                this.insertImage(i.url, i.original);
            });
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadFile(files[0]).subscribe(res => {
            this.insert('<file title="' + res.original + '">' + res.url + '</file>');
        });
    }

    public uploadAudio(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadAudio(files[0]).subscribe(res => {
            this.insert('<audio title="' + res.original + '">' + res.url + '</audio>');
        });
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadVideo(files[0]).subscribe(res => {
            this.insert('<video title="' + res.original + '">' + res.url + '</video>');
        });
    }

    public insertTab() {
        return this.insert('    ', 4, true);
    }

    public insertAt(parent: number, user: string) {
        this.area.value = this.area.value.replace(/<at[\s\S]+?<\/at>/g, '');
        return this.insert('<at parent="' + parent + '">'+ user +'</at>');
    }

    public insert(val: string, move: number = 0, focus: boolean = true) {
        this.checkRange();
        this.setContent(this.area.value.substring(0, this.range.start) + val + this.area.value.substring(this.range.start));
        this.move(move);
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * replace
     */
    public replace(val: (str: string) => string | string, move: number = 0, focus: boolean = true) {
        this.checkRange();
        if (this.range.start === this.range.end) {
            return this.insert(typeof val === 'function' ? val('') : val, move, focus);
        }
        const str = typeof val === 'function' ? val(this.area.value.substring(this.range.start, this.range.end)) : val;
        this.setContent(this.area.value.substring(0, this.range.start) + str + this.area.value.substring(this.range.end));
        this.move(move);
        if (!focus) {
            return;
        }
        this.focus();
    }

    public append(val: string, move: number = 0, focus: boolean = true) {
        this.replace(str => {
            if (str.length < 1) {
                return val;
            }
            if (move < 1) {
                return str + val;
            }
            if (move > val.length) {
                return val + str;
            }
            return val.substring(0, move) + str + val.substring(move);
        }, move, focus);
    }

    public insertImage(file: string, name?: string) {
        this.insert('<img title="' + name + '">' + file + '</img>');
    }

    public clear(focus: boolean = true) {
        this.setContent('');
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * move
     */
    public move(x: number) {
        if (x === 0) {
            return;
        }
        x = this.range.start + x;
        this.range = {
            start: x,
            end: Math.max(x, this.range.end)
        };
    }

    /**
     * focus
     */
    public focus() {
        this.checkRange();
        this.area.selectionStart = this.range.start;
        this.area.selectionEnd = this.range.end;
        this.area.focus();
    }

    private openDialog<T>(data: T, cb: (data: T) => void, check?: (data: T) => boolean|any) {
        this.dialogData.update(v => {
            return {...v, ...data};
        });
        this.modal().open(() => {
            cb(this.dialogData() as any);
        }, () => {
            return check(this.dialogData() as any);
        }, (data as any).title);
    }
    
    public tapAddItem() {
        this.dialogData.update(v => {
            v.items.push({content: ''});
            return {...v}
        });
    }

    public tapRemoveItem(i: number) {
        this.dialogData.update(v => {
            if (v.items.length < 3) {
                return v;
            }
            v.items.splice(i, 1);
            return {...v}
        });
    }

    public setContent(value: string) {
        this.value.set(this.area.value = value);
    }

    public onValueChange(e: Event) {
        this.value.set((e.target as HTMLTextAreaElement).value);
    }

    public onDialogChange(value: string|Event|boolean|number, key: string|number) {
        if (typeof value === 'object') {
            value = ((value as Event).target as HTMLTextAreaElement).value;
        }
        this.dialogData.update(v => {
            if (typeof key === 'number') {
                v.items[key].content = value as any;
            } else {
                v[key] = value;
            }
            return {...v};
        });
    }

}
