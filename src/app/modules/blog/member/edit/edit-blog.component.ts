import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, ViewContainerRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { Location } from '@angular/common';
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
import { asyncScheduler, Subject, Subscription, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-edit-blog',
    templateUrl: './edit-blog.component.html',
    styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly themeService = inject(ThemeService);
    private readonly editor = inject(EditorService);
    private readonly location = inject(Location);
    private readonly destroyRef = inject(DestroyRef);

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

    public readonly tagItems = signal<ITag[]>([]);
    public readonly categories = signal<ICategory[]>([]);
    public readonly languages = signal<string[]>([]);
    public readonly localizes = signal<IItem[]>([]);
    public readonly weathers = signal<IItem[]>([]);
    public readonly licenses = signal<IItem[]>([]);
    public readonly statusItems = signal<IItem[]>([]);
    public readonly openItems = signal<IItem[]>([]);
    public readonly toolItems = signal<IEditorTool[]>([]);
    public readonly addToggle = signal(false);
    public readonly propertyToggle = signal(true);
    public readonly propertyTabIndex = signal(0);
    public readonly propertyTabItems = [$localize `Property`, $localize `Blocks`];
    public readonly size = signal(0);
    public readonly openRule = signal('');
    public readonly openStyle = signal<any>({
        display: 'none'
    });
    public readonly statusStyle = signal<any>({
        display: 'none'
    });
    public readonly openType = computed(() => parseNumber(this.dataForm.open_type().value()));
    public readonly openTypeLabel = computed(() => mapFormat(this.dataForm.open_type().value(), this.openItems()));
    public readonly statusLabel = computed(() => mapFormat(this.dataForm.publish_status().value(), this.statusItems()));
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
        const size$ = new Subject<void>();
        size$.pipe(throttleTime(100, asyncScheduler, { leading: false, trailing: true }), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
            this.size.set(this.editor.wordLength);
        });
        this.service.editOption().subscribe(res => {
            this.tagItems.set(res.tags);
            this.categories.set(res.categories);
            this.languages.set(res.languages);
            this.weathers.set(res.weathers);
            this.licenses.set(res.licenses);
            this.statusItems.set(res.publish_status);
            this.openItems.set(res.open_types);
            this.localizes.set(res.localizes);
            this.dataForm.language().value.set(res.localizes[0].value);
        });
        this.editor.option.merge({
            toolbar: {
                left: ['undo', 'redo'],
            }
        });
        this.toolItems.set(this.editor.option.leftToolbar);
        this.editor.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            size$.next();
            this.editor.autoHeight();
        }).on(EDITOR_EVENT_UNDO_CHANGE, () => {
            this.toolItems.update(v => {
                return v.map(item => {
                    if (item.name === EDITOR_UNDO_TOOL) {
                        item.disabled = !this.editor.canUndo;
                    } else if (item.name === EDITOR_REDO_TOOL) {
                        item.disabled = !this.editor.canRedo;
                    }
                    return item;
                });
            });
            
        }).on(EDITOR_EVENT_CLOSE_TOOL, () => {
            this.editor.modalClear();
        }).on(EDITOR_EVENT_EDITOR_READY, () => {
            size$.next();
        });
        this.propertyToggle.set(window.innerWidth > 769);
        this.themeService.screenSwitch(this.destroyRef, NavigationDisplayMode.Collapse);
        this.route.params.subscribe(params => {
            this.themeService.titleChanged.next(params.id ? $localize `Edit post` : $localize `New post`);
            if (!params.id) {
                return;
            }
            this.loadDetail(params.id);
        });
        afterNextRender({
            write: () => this.editor.ready(this.areaElement().nativeElement, this.modalViewContainer())
        });
        this.destroyRef.onDestroy(() => {
            this.editor.destroy();
        });

    }



    public onLocalizeChange(current: string) {
        this.dataForm.language().value.set(current);
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
                return {...v};
            });
            return;
        }
        this.service.blog(id).subscribe(res => {
            this.cacheItems = res.languages ?? [];
            this.openRule.set(res.open_rule);
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
        this.location.back();
    }

    public toggleProperty() {
        this.propertyToggle.update(v => !v);
    }

    public tapAdd() {
        this.addToggle.update(v => !v);
        this.editor.modalClear();
    }

    public tapOpen(e: MouseEvent) {
        this.editor.modalClear();
        this.openStyle.set({
            display: 'block',
            top: e.clientY + 15 + 'px'
        });
    }

    public changeOpenType(val: any) {
        this.dataForm.open_type().value.set(val);
    }

    public tapStatus(e: MouseEvent) {
        this.editor.modalClear();
        this.statusStyle.set({
            display: 'block',
            top: e.clientY + 15 + 'px'
        });
    }

    public changePublishStatus(v: any) {
        this.dataForm.publish_status().value.set(v);
    }

    public closeModal() {
        const def = {display: 'none'};
        this.openStyle.set(def);
        this.statusStyle.set(def);
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
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
        data.open_rule = data.open_type > 4 ? this.openRule() : '';
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
