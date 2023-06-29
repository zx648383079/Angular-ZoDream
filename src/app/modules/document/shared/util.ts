import { IDocTreeItem } from '../model';

export function treeRemoveId<T extends IDocTreeItem>(data: T[], itemId: number): T[] {
    const removeItem = (id: number, items: IDocTreeItem[]) => {
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.id === id) {
                items.splice(i, 1);
                return true;
            }
            if (element.children && removeItem(id, element.children)) {
                return true;
            }
        }
        return false;
    };
    removeItem(itemId, data);
    return data;
}