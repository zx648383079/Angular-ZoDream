import { Component, effect, input } from '@angular/core';
import { IAttachment } from '../model';

@Component({
    standalone: false,
  selector: 'app-attachment-viewer',
  templateUrl: './attachment-viewer.component.html',
  styleUrls: ['./attachment-viewer.component.scss']
})
export class AttachmentViewerComponent {

    public readonly items = input<IAttachment[]>([]);

    /**
     * 0 表示没有， 1 表示单张图片，2 多张图片 3 音频 4 视频
     */
    public attachmentType = 0;
    public open = false;
    public current = 0;

    constructor() {
        effect(() => {
            this.attachmentType = this.formatType(this.items());
        });
    }

    
    public get largeImage(): string {
        return this.items()[this.current].file;
    }

    public tapPrevious() {
        if (this.current === 0) {
            this.current = this.items().length - 1;
            return;
        }
        this.current --;
    }

    public tapNext() {
        if (this.current === this.items().length - 1) {
            this.current = 0;
            return;
        }
        this.current ++;
    }

    public tapAttachment(i: number) {
        this.open = true;
        this.current = i;
    }

    private formatType(files: IAttachment[]): number {
        if (!files || files.length < 1) {
            return 0;
        }
        const item = files[0];
        const ext = item.file.substring(item.file.lastIndexOf('.'));
        if (['.mp3', '.wav', '.mid', '.flac', '.ape'].indexOf(ext) >= 0) {
            return 3;
        }
        if (['.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg',
        '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm'].indexOf(ext) >= 0) {
            return 4;
        }
        return files.length < 2 ? 1 : 2;
    }
}
