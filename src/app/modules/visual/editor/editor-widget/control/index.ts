import { WidgetSource } from '../../model';
import { ButtonControlComponent } from './button/button-control.component';
import { ButtonControl } from './button/data';
import { CarouselControlComponent } from './carousel/carousel-control.component';
import { CarouselControl } from './carousel/data';
import { ImageControl } from './image/data';
import { ImageControlComponent } from './image/image-control.component';
import { LabelControl } from './label/data';
import { LabelControlComponent } from './label/label-control.component';
import { LineControl } from './line/data';
import { LineControlComponent } from './line/line-control.component';
import { LinkControl } from './link/data';
import { LinkControlComponent } from './link/link-control.component';
import { MapControl } from './map/data';
import { MapControlComponent } from './map/map-control.component';
import { RectangleControl } from './rectangle/data';
import { RectangleControlComponent } from './rectangle/rectangle-control.component';
import { RichTextControl } from './rich-text/data';
import { RichTextControlComponent } from './rich-text/rich-text-control.component';

export const controlComponents = [
    ButtonControlComponent,
    CarouselControlComponent,
    ImageControlComponent,
    LabelControlComponent,
    LineControlComponent,
    LinkControlComponent,
    MapControlComponent,
    RectangleControlComponent,
    RichTextControlComponent,
];

export const controlSource: WidgetSource[] = [
    ButtonControl,
    CarouselControl,
    ImageControl,
    LabelControl,
    LineControl,
    LinkControl,
    MapControl,
    RectangleControl,
    RichTextControl
];