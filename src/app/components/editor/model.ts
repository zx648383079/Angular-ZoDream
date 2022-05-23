export interface IEditor {
    /**
     * 插入图片
     * @param file 
     * @param name 
     */
    insertImage(file: string, name?: string);

    /**
     * 插入链接
     * @param text 
     * @param href 
     */
    insertLink(text: string, href: string);
    /**
     * 插入支付
     * @param val 
     * @param move 
     * @param focus 
     */
    insert(val: string, move?: number, focus?: boolean);
}

export interface IImageUploadEvent {
    files: FileList;
    target: IEditor;
}

export interface IEditorRange {
    start: number;
    end: number;
}