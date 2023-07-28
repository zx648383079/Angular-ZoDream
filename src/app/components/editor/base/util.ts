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
}