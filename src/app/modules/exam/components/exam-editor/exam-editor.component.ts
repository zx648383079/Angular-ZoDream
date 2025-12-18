import { AfterViewInit, Component, ElementRef, OnInit, inject, input, viewChild, model, effect } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { EditorBlockType, EditorService, IEditor, IEditorBlock, IEditorInclueBlock, IEditorLinkBlock, IEditorTextBlock } from '../../../../components/editor';
import { FileUploadService } from '../../../../theme/services';
import { wordLength } from '../../../../theme/utils';
import { MarkRangeMap } from '../math-mark/parser';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-exam-editor',
    templateUrl: './exam-editor.component.html',
    styleUrls: ['./exam-editor.component.scss'],
})
export class ExamEditorComponent implements AfterViewInit, FormValueControl<string>, IEditor, OnInit {
    private readonly uploadService = inject(FileUploadService);
    private readonly toastrService = inject(DialogService);
    private container = inject(EditorService);


    private readonly areaElement = viewChild<ElementRef<HTMLTextAreaElement>>('editorArea');
    public readonly height = input(200);
    public readonly placeholder = input('');
    public readonly label = input('');

    public readonly disabled = input<boolean>(false);
    public readonly value = model<string>('');
    public isPreview = false;
    public previewValue = '';
    public fileName = this.uploadService.uniqueGuid();

    constructor() {
        effect(() => this.container.value = this.value());
    }

    get size() {
        return wordLength(this.value());
    }

    get areaStyle() {
        return {
            height: this.height() + 'px',
        };
    }
    ngOnInit() {
        this.container.on('change', () => {
            this.value.set(this.container.value);
        });
    }

    ngAfterViewInit() {
        this.container.ready(this.areaElement().nativeElement);
    }


    public tapTool(name: string) {
        if (name === 'preview') {
            this.enterPreview();
            return;
        }
        if (name === 'image') {
            return;
        }
        if (name === 'math') {
            this.container.insert(<IEditorInclueBlock>{
                type: EditorBlockType.AddText,
                begin: '$',
                end: '$',
            });
            return;
        }
        if (name === 'link') {
            this.container.insert(<IEditorLinkBlock>{
                type: EditorBlockType.AddLink,
            });
            return;
        }
        if (name === 'input') {
            this.container.insert(<IEditorTextBlock>{
                type: EditorBlockType.AddText,
                value: '____',
                cursor: 3
            });
            return;
        }
        if (Object.prototype.hasOwnProperty.call(MarkRangeMap, name)) {
            const item = MarkRangeMap[name];
            this.container.insert(<IEditorInclueBlock>{
                type: EditorBlockType.AddText,
                begin: item.begin,
                end: item.end,
            });
            return;
        }
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImages(files).subscribe({
            next: res => {
                for (const item of res) {
                    this.insertImage(item.url, item.original);
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public insert(val: IEditorBlock|string) {
        this.container.insert(val);
    }

    public insertImage(file: string, name?: string) {
        this.container.insert('![](' + file + ')');
    }

    public insertLink(text: string, href: string) {
        this.container.insert('[' + text + '](' + href + ')');
    }

    private enterPreview() {
        if (this.isPreview) {
            this.isPreview = false;
            return;
        }
        this.previewValue = this.value();
        this.isPreview = true;
    }

}
