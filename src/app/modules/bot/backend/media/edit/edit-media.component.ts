import { Component, computed, model } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bot-edit-media',
    templateUrl: './edit-media.component.html',
    styleUrls: ['./edit-media.component.scss']
})
export class EditMediaComponent implements FormValueControl<any> {

    public readonly value = model({
        thumb: '',
        title: '',
        type: 'image',
        material_type: 0,
        content: ''
    });
    public typeItems: IItem[] = [
        {name: '图片', value: 'image'},
        {name: '语音', value: 'voice'},
        {name: '视频', value: 'video'},
        {name: '缩略图', value: 'thumb'},
    ];
    public materialTypeItems = ['临时素材', '永久素材'];

    public readonly fileFilter = computed(() => {
        switch (this.value().type) {
            case 'voice':
                return 'audio/*';
            case 'video':
                return 'video/*';
            default:
                return 'image/*';
        }
    });

    public onFileUpload(e: any) {
        this.value.update(v => {
            if (e.thumb) {
                v.thumb = e.thumb;
            }
            if (e.original && !v.title) {
                v.title = e.original;
            }
            v.content = e.url;
            return v;
        });
    }

    public onValueChange(e: Event, key: string) {
        this.value.update(v => {
            v[key] = (e.target as HTMLSelectElement).value
            return v;
        });
    }
}
