export interface MindConfirmEvent<T = any, K = any> {
    next: (data: T|K, link?: K) => void,
    type: 'new' | 'link' | 'new link',
    point?: {
        x: number;
        y: number;
    };
    from?: T;
    to?: T;
}

export interface MindUpdateEvent<T = any> {
    type: 'move'|'delete',
    source: T;
    point?: {
        x: number;
        y: number;
    };
}

export interface MindPointSource {
    id: string|number;
    x?: number;
    y?: number;
    text: string;
}

export interface MindLinkSource {
    /**
     * MindPointSource中的id
     */
    from: string|number;
    /**
     * MindPointSource中的id
     */
    to: string|number;
    text: string;
    color: string;
}