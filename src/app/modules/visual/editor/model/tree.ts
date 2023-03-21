export interface TreeItem {
    icon?: string;
    name: string;
    onEdit?: boolean;
    canExpand?: boolean;
    expand?: boolean;
    active?: boolean;
    level?: number;
    isDefault?: boolean;
    children?: TreeItem[];
}

export enum TREE_ACTION {
    NONE,
    HOME,
    COPY,
    TRASH,
    EDIT,
    CONTEXT, // 右键
}

export interface TreeEvent {
    action: TREE_ACTION,
    data: TreeItem,
    event?: MouseEvent;
}