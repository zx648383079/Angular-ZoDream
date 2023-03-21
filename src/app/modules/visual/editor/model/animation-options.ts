import { IItem } from '../../../../theme/models/seo';

// 动效名称
export const animationLabelOptions: IItem[] = [
    { value: '', name: '无' },
    { value: 'bounce', name: '弹跳' },
    { value: 'fadeIn', name: '渐现' },
    { value: 'fadeOut', name: '渐出' },
    { value: 'flash', name: '闪烁' },
    { value: 'pulse', name: '跳动' },
    { value: 'rubberBand', name: '橡皮筋' },
    { value: 'shake', name: '抖动' },
    { value: 'swing', name: '摆动' },
    { value: 'tada', name: '哒嘟' },
    { value: 'wobble', name: '摇晃' },
    { value: 'jello', name: '扭曲抖动' },
    { value: 'bounceIn', name: '弹入' },
    { value: 'bounceInDown', name: '上弹入' },
    { value: 'bounceInLeft', name: '左弹入' },
    { value: 'bounceInRight', name: '右弹入' },
    { value: 'bounceInUp', name: '下弹入' },
    { value: 'flipInX', name: '水平翻转' },
    { value: 'flipInY', name: '垂直翻转' },
    { value: 'spinning', name: '旋转（顺时针）' },
    { value: 'spinning-reverse', name: '旋转（逆时针）' },
    { value: 'rotateIn', name: '旋入' },
    { value: 'rotateInDownLeft', name: '左下旋转' },
    { value: 'rotateInDownRight', name: '右下旋转' },
    { value: 'rotateInUpLeft', name: '左上旋转' },
    { value: 'rotateInUpRight', name: '右上旋转' },
    { value: 'slideInDown', name: '上滑入' },
    { value: 'slideInLeft', name: '左滑入' },
    { value: 'slideInRight', name: '右滑入' },
    { value: 'slideInUp', name: '下滑入' },
    { value: 'zoomIn', name: '逐渐放大' },
    { value: 'zoomInDown', name: '从下放大' },
    { value: 'zoomInLeft', name: '从左放大' },
    { value: 'zoomInRight', name: '从右放大' },
    { value: 'zoomInUp', name: '从上放大' },
    { value: 'rollIn', name: '滚入' },
    { value: 'lightSpeedIn', name: '闪入' },
];

// 延时时间
export const animationLabelDelayOptions: IItem[] = [
    { value: '', name: '无' },
    { value: '0.1s', name: '100ms' },
    { value: '0.2s', name: '200ms' },
    { value: '0.3s', name: '300ms' },
    { value: '0.5s', name: '500ms' },
    { value: '1s', name: '1s' },
    { value: '2s', name: '2s' },
    { value: '3s', name: '3s' },
    { value: '4s', name: '4s' },
    { value: '5s', name: '5s' },
    { value: '6s', name: '6s' },
    { value: '7s', name: '7s' },
    { value: '8s', name: '8s' },
    { value: '9s', name: '9s' },
    { value: '10s', name: '10s' },
];

// 时长
export const animationLabelDurationOptions: IItem[] = [
    { value: '0.25s', name: '250ms' },
    { value: '0.5s', name: '500ms' },
    { value: '0.75s', name: '750ms' },
    { value: '1s', name: '1s' },
    { value: '2s', name: '2s' },
    { value: '3s', name: '3s' },
    { value: '4s', name: '4s' },
    { value: '5s', name: '5s' },
];

// 重复次数
export const animationIterationCountOptions: IItem[] = [
    { value: '1', name: '1' },
    { value: '2', name: '2' },
    { value: '3', name: '3' },
    { value: '4', name: '4' },
    { value: '5', name: '5' },
    { value: '6', name: '6' },
    { value: '7', name: '7' },
    { value: '8', name: '8' },
    { value: '9', name: '9' },
    { value: '10', name: '10' },
    { value: 'infinite', name: '无限循环' },
];

export const animationFuncOptions: IItem[] = [
    { value: 'linear', name: '线性' },
    { value: 'ease', name: 'ease' },
    { value: 'ease-in', name: 'ease-in' },
    { value: 'ease-out', name: 'ease-out' },
    { value: 'ease-in-out', name: 'ease-in-out' },
];