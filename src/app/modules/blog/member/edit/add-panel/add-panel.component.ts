import { Component, inject, input, output, signal } from '@angular/core';
import { IUploadFile } from '../../../../../theme/models/open';
import { FileUploadService, SearchService } from '../../../../../theme/services';
import { IPageQueries } from '../../../../../theme/models/page';
import { EditorBlockType, IEditorBlock } from '../../../../../components/editor';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-blog-add-panel',
    templateUrl: './add-panel.component.html',
    styleUrls: ['./add-panel.component.scss'],
})
export class AddPanelComponent {
    private readonly uploadService = inject(FileUploadService);
    private readonly searchService = inject(SearchService);


    public readonly visible = input(false);
    public readonly toolTapped = output<string>();
    public readonly command = output<IEditorBlock>();
    public readonly tabIndex = signal(0);
    public tabItems = ['组件', '模板', '资源'];
    public toolItems: {
        header: string;
        items: {
            name: string;
            icon: string;
            label: string;
        }[]
    }[] = [
        {
            header: 'Text',
            items: [
                {
                    name: 'bold',
                    icon: 'icon-bold',
                    label: $localize `Font Bold`,
                },
                {
                    name: 'link',
                    icon: 'icon-chain',
                    label: $localize `Add Link`,
                },
                {
                    name: 'image',
                    icon: 'icon-image',
                    label: $localize `Add Image`,
                },
                {
                    name: 'code',
                    icon: 'icon-code',
                    label: $localize `Add Code`,
                }
            ]
        }
    ];
    public mediaGroupItems: {
        name: string;
    }[] = [
        {name: $localize `Images`}
    ];
    public mediaOpen = false;
    public readonly isLoading = signal(false);
    private hasMore = false;
    public mediaItems: IUploadFile[] = [];
    public readonly mediaQueries = form(signal({
        keywords: '',
        accept: '*/*',
        page: 1,
        per_page: 20,
    }));

    public tapTab(i: number) {
        this.tabIndex.set(i);
        this.mediaOpen = false;
    }


    public tapTool(item: any) {
        this.toolTapped.emit(item.name);
    }

    public openMedia(item: any) {
        this.mediaOpen = true;
        this.tapRefresh();
    }

    public tapMedia(item: IUploadFile) {
        this.mediaOpen = false;
        this.command.emit({
            type: EditorBlockType.AddImage,
            value: item.url,
            title: item.title
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        this.goPage(this.mediaQueries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.mediaQueries().value(), page};
        this.uploadService.images.call(this.uploadService, queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.mediaItems = page > 1 ? [].concat(this.mediaItems, res.data) : res.data;
                this.hasMore = res.paging.more;
                this.mediaQueries().value.set(queries)
            }, 
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }
}
