export interface MindConfirmEvent {
    next: (data: any, link?: any) => void,
    type: 'new' | 'link' | 'new link',
    point?: {
        x: number;
        y: number;
    };
    from?: any;
    to?: any;
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