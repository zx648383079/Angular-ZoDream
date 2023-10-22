import { eachObject } from '../../../theme/utils';

export class EditorHelper {
    public static fileType(file: File): 'image'|'video'|'file' {
        if (file.type.indexOf('image') >= 0) {
            return 'image';
        }
        if (file.type.indexOf('video') >= 0) {
            return 'video';
        }
        return 'file';
    }

    public static height(node: HTMLElement): number {
        return node.offsetHeight;
    }

    public static css(node: HTMLElement, style: any) {
        eachObject(style, (val, key) => {
            node.style[key] = val;
        });
    }
}