import { IBotReplyTemplateField } from './model';

export function formatTemplateField(content: string): IBotReplyTemplateField[] {
    const reg = /\{\{([^\{]+)\.DATA\}\}/g;
    const items: IBotReplyTemplateField[] = [];
    let res;
    while (res = reg.exec(content)) {
        items.push({
            name: res[1]
        });
    }
    return items;
}

export function renderTemplateField(content: string, items: IBotReplyTemplateField[]): string {
    return content.replace(/\{\{([^\{]+)\.DATA\}\}/g, (_, match) => {
        for (const item of items) {
            if (item.name === match) {
                return typeof item.value === 'undefined' ? '' : item.value;
            }
        }
        return '';
    });
}