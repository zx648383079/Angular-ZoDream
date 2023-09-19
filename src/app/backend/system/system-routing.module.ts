import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemComponent } from './system.component';
import { CacheComponent } from './cache/cache.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { SqlComponent } from './sql/sql.component';
import { WordComponent } from './word/word.component';
import { EmojiCategoryComponent } from './emoji/category/emoji-category.component';
import { EmojiComponent } from './emoji/emoji.component';
import { AgreementComponent } from './agreement/agreement.component';
import { EditAgreementComponent } from './agreement/edit/edit-agreement.component';
import { AgreementEditorComponent } from './agreement/editor/agreement-editor.component';
import { PluginComponent } from './plugin/plugin.component';

const routes: Routes = [
    {
        path: 'agreement/create',
        component: EditAgreementComponent,
    },
    {
        path: 'agreement/edit/:id',
        component: EditAgreementComponent,
    },
    {
        path: 'agreement',
        component: AgreementComponent,
    },
    {
        path: 'word',
        component: WordComponent,
    },
    {
        path: 'emoji/category',
        component: EmojiCategoryComponent,
    },
    {
        path: 'emoji',
        component: EmojiComponent,
    },
    {
        path: 'cache',
        component: CacheComponent
    },
    {
        path: 'sitemap',
        component: SitemapComponent
    },
    {
        path: 'sql',
        component: SqlComponent
    },
    {
        path: 'plugin',
        component: PluginComponent
    },
    { path: '', component: SystemComponent },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemRoutingModule { }

export const systemRoutedComponents = [
    SystemComponent, CacheComponent, SqlComponent, SitemapComponent, WordComponent, EmojiCategoryComponent, EmojiComponent, EditAgreementComponent, AgreementComponent, AgreementEditorComponent,
    PluginComponent
];
