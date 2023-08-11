import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from './swiper.component';
import { SwiperItemComponent } from './swiper-item.component';
import { SwiperItemDirective } from './swiper-item.directive';
import { FlipContainerComponent } from './flip/flip-container.component';
import { FlipItemComponent } from './flip/flip-item.component';

const COMPONENTS = [
    SwiperComponent,
    SwiperItemComponent,
    SwiperItemDirective,
    FlipContainerComponent,
    FlipItemComponent,
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [	
        ...COMPONENTS
   ],
    exports: [
        ... COMPONENTS
    ]
})
export class ZreSwiperModule { }
