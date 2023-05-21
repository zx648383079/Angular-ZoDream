import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from './swiper.component';
import { SwiperItemComponent } from './swiper-item.component';
import { SwiperItemDirective } from './swiper-item.directive';

const COMPONENTS = [
    SwiperComponent,
    SwiperItemComponent,
    SwiperItemDirective
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
