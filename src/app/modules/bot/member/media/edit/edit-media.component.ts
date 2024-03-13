import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IItem } from '../../../../../theme/models/seo';

@Component({
  selector: 'app-bot-m-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.scss']
})
export class EditMediaComponent {

    @Input() public value: any = {
        title: '',
        type: 'image',
        material_type: 0
    };
    @Output() public valueChange = new EventEmitter<any>();
    public typeItems: IItem[] = [
        {name: '图片', value: 'image'},
        {name: '语音', value: 'voice'},
        {name: '视频', value: 'video'},
        {name: '缩略图', value: 'thumb'},
    ];
    public materialTypeItems = ['临时素材', '永久素材'];

    constructor() { }

    public get fileFilter() {
        switch (this.value.type) {
            case 'voice':
                return 'audio/*';
            case 'video':
                return 'video/*';
            default:
                return 'image/*';
        }
    }

    public onValueChange() {
        this.valueChange.emit(this.value);
    }

    public onFileUpload(e: any) {
        if (e.thumb) {
            this.value.thumb = e.thumb;
        }
        if (e.original && !this.value.title) {
            this.value.title = e.original;
            this.onValueChange();
        }
    }
}
