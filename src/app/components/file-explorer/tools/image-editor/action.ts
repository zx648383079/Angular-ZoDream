import { CanvasLayer } from './CanvasLayer';



export interface IImageAction {
    icon: string;
    label: string;
    action: (layer: CanvasLayer) => void;
}

export const ImageActionItems: (IImageAction|undefined)[] = [
    {
        icon: 'icon-search-plus',
        label: '放大',
        action(layer) {
            layer.scale(1.2);
        },
    },
    {
        icon: 'icon-search-minus',
        label: '缩小',
        action(layer) {
            layer.scale(.8);
        },
    },
    undefined,
    {
        icon: 'icon-arrows-h',
        label: '水平翻转',
        action(layer) {
            layer.scale(-1, 1);
        },
    },
    {
        icon: 'icon-arrows-v',
        label: '垂直翻转',
        action(layer) {
            layer.scale(1, -1);
        },
    },
    undefined,
    {
        icon: 'icon-rotate-left',
        label: '逆时针旋转15°',
        action(layer) {
            layer.rotate(-15);
        },
    },
    {
        icon: 'icon-repeat',
        label: '顺时针旋转15°',
        action(layer) {
            layer.rotate(15);
        },
    },
    undefined,
    {
        icon: 'icon-arrow-up',
        label: '图片上移',
        action(layer) {
            layer.translate(0, -10);
        },
    },
    {
        icon: 'icon-arrow-down',
        label: '图片下移',
        action(layer) {
            layer.translate(0, 10);
        },
    },
    {
        icon: 'icon-arrow-left',
        label: '图片左移',
        action(layer) {
            layer.translate(-10, 0);
        },
    },
    {
        icon: 'icon-arrow-right',
        label: '图片右移',
        action(layer) {
            layer.translate(10, 0);
        },
    },
];