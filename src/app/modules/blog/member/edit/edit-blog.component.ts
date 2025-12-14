import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewContainerRef, computed, inject, signal, viewChild } from '@angular/core';
import { IBlog, ICategory, ITag } from '../../model';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { mapFormat, parseNumber } from '../../../../theme/utils';
import { EDITOR_EVENT_CLOSE_TOOL, EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_EDITOR_READY, EDITOR_EVENT_UNDO_CHANGE, EDITOR_REDO_TOOL, EDITOR_UNDO_TOOL, EditorBlockType, EditorService, IEditorBlock, IEditorFileBlock, IEditorTool, IImageUploadEvent } from '../../../../components/editor';
import { IItem } from '../../../../theme/models/seo';
import { FileUploadService, ThemeService } from '../../../../theme/services';
import { NavigationDisplayMode } from '../../../../theme/models/event';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-blog',
    templateUrl: './edit-blog.component.html',
    styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private uploadService = inject(FileUploadService);
    private readonly themeService = inject(ThemeService);
    private editor = inject(EditorService);

    private cacheItems: IItem[] = [];


    private readonly areaElement = viewChild<ElementRef<HTMLTextAreaElement>>('editorArea');
    private readonly modalViewContainer = viewChild('modalVC', { read: ViewContainerRef });
    public readonly dataModel = signal({
        id: 0,
        title: '',
        parent_id: 0,
        language: 'zh',
        keywords: '',
        description: '',
        term_id: '',
        programming_language: '',
        type: '0',
        thumb: '',
        open_type: '0',
        open_rule: '',
        edit_type: '1',
        source_url: '',
        source_author: '',
        is_hide: 0,
        weather: '',
        audio_url: '',
        video_url: '',
        cc_license: '',
        comment_status: 0,
        publish_status: 0,
        seo_title: '',
        seo_description: '',
        seo_link: '',
        created_at: '-',
        tags: []
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.term_id);
    });

    public readonly pageLink = computed(() => '/blog/' + this.dataForm.seo_link().value());

    public readonly metaSize = computed(() => this.dataForm.description().value().length);

    public tagItems: ITag[] = [];
    public categories: ICategory[] = [];
    public languages: string[] = [];
    public localizes: IItem[] = [];
    public weathers: IItem[] = [];
    public licenses: IItem[] = [];
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

    public readonly openType = computed(() => parseNumber(this.dataForm.open_type().value()));
    public readonly openTypeLabel = computed(() => mapFormat(this.dataForm.open_type().value(), this.openItems));
    public readonly statusLabel = computed(() => mapFormat(this.dataForm.publish_status().value(), this.statusItems));
    public readonly typeValue = computed(() => parseNumber(this.dataForm.type().value()));

    public readonly ruleLabel = computed(() => {
        const val = parseNumber(this.dataForm.open_type().value());
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
    });

    constructor() {
        this.service.editOption().subscribe(res => {
            this.tagItems = res.tags;
            this.categories = res.categories;
            this.languages = res.languages;
            this.weathers = res.weathers;
            this.licenses = res.licenses;
            this.statusItems = res.publish_status;
            this.openItems = res.open_types;
            this.localizes = res.localizes;
            this.dataForm.language().value.set(res.localizes[0].value);
        });
        this.editor.option.merge({
            toolbar: {
                left: ['undo', 'redo'],
            }
        });
        this.toolItems = this.editor.option.leftToolbar;
        this.editor.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            this.size = this.editor.wordLength;
            this.editor.autoHeight();
        }).on(EDITOR_EVENT_UNDO_CHANGE, () => {
            for (const item of this.toolItems) {
                if (item.name === EDITOR_UNDO_TOOL) {
                    item.disabled = !this.editor.canUndo;
                } else if (item.name === EDITOR_REDO_TOOL) {
                    item.disabled = !this.editor.canRedo;
                }
            }
        }).on(EDITOR_EVENT_CLOSE_TOOL, () => {
            this.editor.modalClear();
        }).on(EDITOR_EVENT_EDITOR_READY, () => {
            setTimeout(() => {
                this.size = this.editor.wordLength;
            }, 10);
        })
    }

    ngOnInit() {
        this.propertyToggle = window.innerWidth > 769;
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Collapse);
        this.route.params.subscribe(params => {
            this.themeService.titleChanged.next(params.id ? $localize `Edit post` : $localize `New post`);
            if (!params.id) {
                return;
            }
            this.loadDetail(params.id);
        });
    }

    ngAfterViewInit(): void {
        this.editor.ready(this.areaElement().nativeElement, this.modalViewContainer());
    }

    ngOnDestroy(): void {
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
        this.editor.destroy();
    }



    public onLocalizeChange() {
        const current = this.dataForm.language().value();
        if (this.cacheItems.length == 0) {
            this.loadDetail(0, current);
            return;
        }
        for (const item of this.cacheItems) {
            if (item.value === current) {
                this.loadDetail(item.id, item.value);
                return;
            }
        }
        this.loadDetail(0, current);
    }

    public loadDetail(id: number, language?: string) {
        id = parseNumber(id);
        if (this.dataModel().id === id) {
            return;
        }
        if (id < 1) {
            this.setContent('');
            this.dataModel.update(v => {
                v.id = 0;
                v.title = '';
                v.parent_id = v.parent_id > 0 ? v.parent_id : v.id;
                v.language = language;
                v.created_at = '-'
                return v;
            });
            return;
        }
        this.service.blog(id).subscribe(res => {
            this.cacheItems = res.languages ?? [];
            this.openRule = res.open_rule;
            this.setContent(res.content);
            this.dataModel.set({
                id: res.id,
                title: res.title,
                parent_id: res.id,
                language: res.language,
                keywords: res.keywords,
                description: res.description,
                term_id: res.term_id as any,
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
                created_at: res.created_at,
                tags: res.tags || []
            });
        });
    }



    public addTagFn(name: string) {
        return {name};
    }

    public tapTool(item: IEditorTool|string, event?: MouseEvent) {
        this.editor.emitTool(item, event);
    }

    public tapCommand(item: IEditorBlock) {
        this.editor.insert(item);
    }

    public tapBack() {
        history.back();
    }

    public tapAdd() {
        this.addToggle = !this.addToggle;
        this.editor.modalClear();
    }

    public tapOpen(e: MouseEvent) {
        this.editor.modalClear();
        this.openStyle = {
            display: 'block',
            top: e.clientY + 15 + 'px'
        };
    }

    public changeOpenType(val: any) {
        this.dataForm.open_type().value.set(val);
    }

    public tapStatus(e: MouseEvent) {
        this.editor.modalClear();
        this.statusStyle = {
            display: 'block',
            top: e.clientY + 15 + 'px'
        };
    }

    public changePublishStatus(v: any) {
        this.dataForm.publish_status().value.set(v);
    }

    public closeModal() {
        this.openStyle = this.statusStyle = {display: 'none',};
    }

    public tapSubmit(e?: ButtonEvent, status?: number) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IBlog = this.dataForm().value() as any;
        if (typeof status === 'number') {
            data.publish_status = status;
        }
        data.content = this.editor.value;
        data.open_rule = data.open_type > 4 ? this.openRule : '';
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

    private setContent(val: string) {
        this.editor.value = val;
        this.editor.autoHeight();
    }

}
