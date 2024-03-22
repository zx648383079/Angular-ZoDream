import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IBlog, ICategory, ITag } from '../../model';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { mapFormat, parseNumber } from '../../../../theme/utils';
import { EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_EDITOR_READY, EditorBlockType, EditorService, IEditorFileBlock, IEditorTool, IImageUploadEvent } from '../../../../components/editor';
import { IItem } from '../../../../theme/models/seo';
import { FileUploadService, SearchService } from '../../../../theme/services';
import { NavToggle, SearchEvents } from '../../../../theme/models/event';

@Component({
    selector: 'app-edit-blog',
    templateUrl: './edit-blog.component.html',
    styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('editorArea')
    private areaElement: ElementRef<HTMLTextAreaElement>;
    @ViewChild('modalVC', {read: ViewContainerRef})
    private modalViewContainer: ViewContainerRef;
    public form = this.fb.group({
        title: ['', Validators.required],
        keywords: [''],
        content: ['', Validators.required],
        description: [''],
        term_id: [0, Validators.required],
        programming_language: [''],
        type: ['0'],
        thumb: [''],
        open_type: ['0'],
        open_rule: [''],
        edit_type: ['1'],
        source_url: [''],
        source_author: [''],
        is_hide: [0],
        weather: [''],
        audio_url: [''],
        video_url: [''],
        cc_license: [''],
        comment_status: [''],
        publish_status: [0],
        seo_title: [''],
        seo_description: [''],
        seo_link: [''],
    });

    public data: IBlog;
    public tagItems: ITag[] = [];
    public categories: ICategory[] = [];
    public languages: string[] = [];
    public weathers: IItem[] = [];
    public licenses: IItem[] = [];
    public tags: ITag[] = [];
    public statusItems: IItem[] = [];
    public openItems: IItem[] = [];
    public toolItems: IEditorTool[] = [];
    public addToggle = false;
    public propertyToggle = true;
    public propertyTabIndex = 0;
    public propertyTabItems = [$localize `Property`, $localize `Blocks`];
    public size = 0;
    public openRule = '';
    public openStyle: any = {
        display: 'none'
    };
    public statusStyle: any = {
        display: 'none'
    };

    constructor(
        private fb: FormBuilder,
        private service: BlogService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
        private searchService: SearchService,
        private editor: EditorService,
    ) {
        this.service.editOption().subscribe(res => {
            this.tagItems = res.tags;
            this.categories = res.categories;
            this.languages = res.languages;
            this.weathers = res.weathers;
            this.licenses = res.licenses;
            this.statusItems = res.publish_status;
            this.openItems = res.open_types;
        });
        this.editor.option.merge({
            toolbar: {
                left: ['bold', 'link', 'image', 'code', 'undo', 'redo'],
            }
        });
        this.toolItems = this.editor.option.leftToolbar;
        this.editor.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            this.size = this.editor.wordLength;
            this.editor.autoHeight();
        }).on(EDITOR_EVENT_EDITOR_READY, () => {
            setTimeout(() => {
                this.size = this.editor.wordLength;
            }, 10);
        })
    }

    ngOnInit() {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, NavToggle.Hide);
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.loadDetail(params.id);
        });
    }

    ngAfterViewInit(): void {
        this.editor.ready(this.areaElement.nativeElement, this.modalViewContainer);
    }

    ngOnDestroy(): void {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, NavToggle.Unreal);
        this.editor.destroy();
    }

    get pageLink() {
        return '/blog/' + this.form.get('seo_link').value;
    }

    get metaSize() {
        return this.form.get('description').value.length;
    }

    get publishStatus() {
        return this.form.get('publish_status').value;
    }

    public loadDetail(id: number, language?: string) {
        id = parseNumber(id);
        if (this.data && this.data.id === id) {
            return;
        }
        if (id < 1) {
            this.data.parent_id = this.data.parent_id > 0 ? this.data.parent_id : this.data.id;
            this.data.id = 0;
            this.data.language = language as any;
            this.form.patchValue({
                title: '',
                content: '',
            });
            return;
        }
        this.service.blog(id).subscribe(res => {
            this.data = res;
            this.tags = res.tags || [];
            this.openRule = res.open_rule;
            this.form.patchValue({
                title: res.title,
                content: res.content,
                keywords: res.keywords,
                description: res.description,
                term_id: res.term_id,
                programming_language: res.programming_language,
                type: res.type as any,
                thumb: res.thumb,
                open_type: res.open_type as any,
                open_rule: res.open_rule,
                edit_type: res.edit_type as any,
                source_url: res.source_url,
                source_author: res.source_author,
                is_hide: res.is_hide,
                weather: res.weather,
                audio_url: res.audio_url,
                video_url: res.video_url,
                cc_license: res.cc_license,
                publish_status: res.publish_status,
                comment_status: res.comment_status as any,
                seo_title: res.seo_title,
                seo_description: res.seo_description,
                seo_link: res.seo_link,
            });
        });
    }

    public get typeValue() {
        return parseNumber(this.form.get('type').value);
    }

    public get openType() {
        return parseNumber(this.form.get('open_type').value);
    }

    public get openTypeLabel() {
        return mapFormat(this.openType, this.openItems);
    }

    public get statusLabel() {
        return mapFormat(this.publishStatus, this.statusItems);
    }

    public get ruleLabel() {
        const val = this.openType;
        if (val < 5) {
            return '';
        }
        if (val === 5) {
            return $localize `Password for read`;
        }
        if (val === 6) {
            return $localize `Price for buy`;
        }
        return $localize `Rule`;
    }

    public addTagFn(name: string) {
        return {name};
    }

    public tapTool(item: IEditorTool, event: MouseEvent) {
        this.editor.emitTool(item, event);
    }

    public tapBack() {
        history.back();
    }

    public tapOpen(e: MouseEvent) {
        this.openStyle = {
            display: 'block',
            top: e.clientY + 15 + 'px'
        };
    }

    public changeOpenType(v: any) {
        this.form.patchValue({
            open_type: v
        });
    }

    public tapStatus(e: MouseEvent) {
        this.statusStyle = {
            display: 'block',
            top: e.clientY + 15 + 'px'
        };
    }

    public changePublishStatus(v: any) {
        this.form.patchValue({
            publish_status: v
        });
    }

    public closeModal() {
        this.openStyle = this.statusStyle = {display: 'none',};
    }

    public tapSubmit(e?: ButtonEvent, status?: number) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IBlog = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (this.data && this.data.parent_id) {
            data.parent_id = this.data.parent_id;
        }
        if (this.data && this.data.language) {
            data.language = this.data.language;
        }
        if (typeof status === 'number') {
            data.publish_status = status;
        }
        data.open_rule = data.open_type > 4 ? this.openRule : '';
        data.tags = this.tags;
        e?.enter();
        this.service.blogSave(data).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }

    public editorImageUpload(event: IImageUploadEvent) {
        this.uploadService.uploadImages(event.files).subscribe(res => {
            for (const item of res) {
                event.target.insert(<IEditorFileBlock>{
                    type: EditorBlockType.AddImage,
                    value: item.url,
                    title: item.original,
                    size: item.size
                });
            }
        });
    }

}
