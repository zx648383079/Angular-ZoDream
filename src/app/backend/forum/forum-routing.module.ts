import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumComponent } from './forum.component';
import { EmojiCategoryComponent } from './setting/emoji/category/emoji-category.component';
import { EmojiComponent } from './setting/emoji/emoji.component';
import { WordComponent } from './setting/word/word.component';

const routes: Routes = [
    {
        path: 'setting/word',
        component: WordComponent,
    },
    {
        path: 'setting/emoji/category',
        component: EmojiCategoryComponent,
    },
    {
        path: 'setting/emoji',
        component: EmojiComponent,
    },
    {
        path: '',
        component: ForumComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }

export const forumRoutedComponents = [
  ForumComponent, WordComponent, EmojiCategoryComponent, EmojiComponent
];
