import { EditorCodeComponent } from '../modal/code/editor-code.component';
import { EditorColorComponent } from '../modal/color/editor-color.component';
import { EditorDropdownComponent } from '../modal/dropdown/editor-dropdown.component';
import { EditorFileComponent } from '../modal/file/editor-file.component';
import { EditorImageComponent } from '../modal/image/editor-image.component';
import { EditorLinkComponent } from '../modal/link/editor-link.component';
import { EditorTableComponent } from '../modal/table/editor-table.component';
import { EditorVideoComponent } from '../modal/video/editor-video.component';
import { EditorBlockType } from '../model';
import { EDITOR_ADD_TOOL, EDITOR_CLOSE_TOOL, EDITOR_CODE_TOOL, EDITOR_ENTER_TOOL, EDITOR_FULL_SCREEN_TOOL, EDITOR_IMAGE_TOOL, EDITOR_LINK_TOOL, EDITOR_MORE_TOOL, EDITOR_PREVIEW_TOOL, EDITOR_REDO_TOOL, EDITOR_TABLE_TOOL, EDITOR_UNDO_TOOL, EDITOR_VIDEO_TOOL } from './event';
import { IEditorModule } from './option';

export const EditorModules: IEditorModule[] = [
    {
        name: 'text',
        icon: 'icon-char',
        label: $localize `Edit Text`,
    },
    {
        name: 'paragraph',
        icon: 'icon-paragraph',
        label: $localize `Edit Paragraph'`,
    },
    {
        name: EDITOR_ADD_TOOL,
        icon: 'icon-plus',
        label: $localize `Add Content`,
    },
    {
        name: EDITOR_UNDO_TOOL,
        icon: 'icon-undo',
        label: $localize `Undo`,
        hotKey: 'Ctrl+Z',
        handler(editor) {
            editor.undo();
        }
    },
    {
        name: EDITOR_REDO_TOOL,
        icon: 'icon-redo',
        label: $localize `Redo`,
        hotKey: 'Ctrl+Shift+Z',
        handler(editor) {
            editor.redo();
        }
    },
    {
        name: EDITOR_MORE_TOOL,
        icon: 'icon-ellipsis-v',
        label: $localize `More`
    },
    {
        name: EDITOR_PREVIEW_TOOL,
        icon: 'icon-eye',
        label: $localize `Preview`
    },
    {
        name: EDITOR_CLOSE_TOOL,
        icon: 'icon-close',
        label: $localize `Close`
    },

    {
        name: EDITOR_ENTER_TOOL,
        icon: 'icon-enter',
        label: $localize `Link Break`,
        handler(editor) {
            editor.insert({type: EditorBlockType.AddLineBreak});
        }
    },
    // 文字处理
    {
        name: 'heading',
        icon: 'icon-heading',
        label: $localize `Heading`,
        parent: 'text',
        modal: EditorDropdownComponent,
        handler(editor, _, data) {
            editor.insert({...data, type: EditorBlockType.Heading});
        },
    },
    {
        name: 'bold',
        icon: 'icon-bold',
        label: $localize `Font Bold`,
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Bold});
        },
    },
    {
        name: 'italic',
        icon: 'icon-italic',
        label: $localize `Font Italic`,
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Italic});
        },
    },
    {
        name: 'underline',
        icon: 'icon-underline',
        label: $localize `Add Underline`,
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Underline});
        },
    },
    {
        name: 'wavyline',
        icon: 'icon-wavy-line',
        label: $localize `Add Wavyline`,
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Wavyline});
        },
    },
    {
        name: 'dashed',
        icon: 'icon-dottedunderline',
        label: '下标加点',
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Dashed});
        },
    },
    {
        name: 'strike',
        icon: 'icon-strike',
        label: '画线',
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Strike});
        },
    },
    {
        name: 'sub',
        icon: 'icon-sub',
        label: '下标',
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Sub});
        },
    },
    {
        name: 'sup',
        icon: 'icon-sup',
        label: '上标',
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.Sub});
        },
    },
    {
        name: 'fontsize',
        icon: 'icon-font-size',
        label: $localize `Font Size`,
        parent: 'text',
        modal: EditorDropdownComponent,
        handler(editor, _, data) {
            editor.insert({...data, type: EditorBlockType.FontSize});
        },
    },
    {
        name: 'font',
        icon: 'icon-pencil',
        label: $localize `Font Family`,
        parent: 'text',
        modal: EditorDropdownComponent,
        handler(editor, _, data) {
            editor.insert({...data, type: EditorBlockType.FontFamily});
        },
    },
    {
        name: 'foreground',
        icon: 'icon-font-foreground',
        label: $localize `Font Color`,
        parent: 'text',
        modal: EditorColorComponent,
        handler(editor, _, data) {
            editor.insert({...data, type: EditorBlockType.Foreground});
        },
    },
    {
        name: 'background',
        icon: 'icon-editor-background-color',
        label: $localize `Background`,
        parent: 'text',
        modal: EditorColorComponent,
        handler(editor, _, data) {
            editor.insert({...data, type: EditorBlockType.Background});
        },
    },
    {
        name: 'clear',
        icon: 'icon-clearformat',
        label: $localize `Clear Style`,
        parent: 'text',
        handler(editor) {
            editor.insert({type: EditorBlockType.ClearStyle});
        },
    },

    // 段落处理
    {
        name: 'align-left',
        icon: 'icon-alignleft',
        label: $localize `Algin Left`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Align, value: 'left'})
        },
    },
    {
        name: 'align-center',
        icon: 'icon-aligncenter',
        label: $localize `Algin Center`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Align, value: 'center'})
        },
    },
    {
        name: 'align-right',
        icon: 'icon-alignright',
        label: $localize `Algin Right`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Align, value: 'right'})
        },
    },
    {
        name: 'align-justify',
        icon: 'icon-alignjustify',
        label: $localize `Algin Justify`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Align, value: ''})
        },
    },
    {
        name: 'list',
        icon: 'icon-orderedlist',
        label: $localize `As List`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.List});
        },
    },
    {
        name: 'indent',
        icon: 'icon-indent',
        label: $localize `Line Indent`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Indent});
        },
    },
    {
        name: 'outdent',
        icon: 'icon-outdent',
        label: $localize `Line Outdent`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Outdent});
        },
    },
    {
        name: 'blockquote',
        icon: 'icon-blockquote',
        label: $localize `Add Blockquote`,
        parent: 'paragraph',
        handler(editor) {
            editor.insert({type: EditorBlockType.Blockquote});
        },
    },


    // 添加
    {
        name: 'link',
        icon: 'icon-chain',
        label: $localize `Add Link`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorLinkComponent,
        handler(editor, range, data) {
            editor.insert({
                type: EditorBlockType.AddLink,
                ...data                
            }, range);
        },
    },
    {
        name: 'image',
        icon: 'icon-image',
        label: $localize `Add Image`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorImageComponent,
        handler(editor, range, data) {
            editor.insert({
                type: EditorBlockType.AddImage,
                ...data                
            }, range);
        },
    },
    {
        name: 'video',
        icon: 'icon-file-movie-o',
        label: $localize `Add Video`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorVideoComponent,
        handler(editor, range, data) {
            editor.insert({
                type: EditorBlockType.AddVideo,
                ...data                
            }, range);
        },
    },
    {
        name: 'table',
        icon: 'icon-table',
        label: $localize `Add Table`,
        parent: 'add',
        modal: EditorTableComponent,
        handler(editor, range, data) {
            editor.insert({
                type: EditorBlockType.AddTable,
                ...data                
            }, range);
        },
    },
    {
        name: 'file',
        icon: 'icon-file-o',
        label: $localize `Add File`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorFileComponent,
        handler(editor, range, data) {
            editor.insert({
                type: EditorBlockType.AddFile,
                ...data                
            }, range);
        },
    },
    {
        name: 'code',
        icon: 'icon-code',
        label: $localize `Add Code`,
        parent: EDITOR_ADD_TOOL,
        modal: EditorCodeComponent,
        handler(editor, range, data) {
            editor.insert({
                type: EditorBlockType.AddCode,
                ...data                
            }, range);
        },
    },
    // {
    //     name: 'search',
    //     icon: 'icon-search',
    //     label: $localize `Insert Any Artcles`,
    //     parent: EDITOR_ADD_TOOL,
    //     modal: EditorSearchComponent,
    //     handler(editor, range, data) {
    //         editor.insert({
    //             type: EditorBlockType.AddData,
    //             ...data                
    //         }, range);
    //     },
    // },
    {
        name: 'line',
        icon: 'icon-minus',
        label: $localize `Add Line`,
        parent: EDITOR_ADD_TOOL,
        handler(editor) {
            editor.insert({type: EditorBlockType.AddHr});
        }
    },

    // 更多
    {
        name: EDITOR_FULL_SCREEN_TOOL,
        icon: 'icon-full-screen',
        label: $localize `Toggle Full Screen`,
        parent: EDITOR_MORE_TOOL,
    },
    {
        name: 'select-all',
        icon: 'icon-selectall',
        label: $localize `Select All`,
        parent: EDITOR_MORE_TOOL,
        handler(editor, range, data) {
            editor.selectAll();
        },
    },
    {
        name: EDITOR_CODE_TOOL,
        icon: 'icon-code',
        label: $localize `View Code`,
        parent: EDITOR_MORE_TOOL,
    },

    // 图片处理
    {
        name: 'replace-image',
        icon: 'icon-exchange',
        label: '替换',
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'align-image',
        icon: 'icon-alignright',
        label: '位置',
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'caption-image',
        icon: 'icon-image',
        label: '图片标题',
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'delete-image',
        icon: 'icon-trash',
        label: '删除图片',
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'link-image',
        icon: 'icon-chain',
        label: '插入链接',
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'alt-image',
        icon: 'icon-char',
        label: '图片备注',
        parent: EDITOR_IMAGE_TOOL, 
    },
    {
        name: 'size-image',
        icon: 'icon-ruler',
        label: '调整尺寸',
        parent: EDITOR_IMAGE_TOOL, 
    },
    
    // 视频处理
    {
        name: 'replace-video',
        icon: 'icon-exchange',
        label: '替换',
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'align-video',
        icon: 'icon-alignright',
        label: '位置',
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'caption-video',
        icon: 'icon-film',
        label: '视频标题',
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'delete-video',
        icon: 'icon-trash',
        label: '删除视频',
        parent: EDITOR_VIDEO_TOOL, 
    },
    {
        name: 'size-video',
        icon: 'icon-ruler',
        label: '调整尺寸',
        parent: EDITOR_VIDEO_TOOL, 
    },

    // 表格处理

    {
        name: 'header-table',
        icon: 'icon-table',
        label: '表头',
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.insert({type: EditorBlockType.Thead});
        },
    },
    {
        name: 'footer-table',
        icon: 'icon-table',
        label: '表尾',
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.insert({type: EditorBlockType.TFoot});
        },
    },
    {
        name: 'delete-table',
        icon: 'icon-trash',
        label: '删除表格',
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.insert({type: EditorBlockType.DeleteTable});
        },
    },
    {
        name: 'row-table',
        icon: 'icon-table',
        label: '行',
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'column-table',
        icon: 'icon-table',
        label: '列',
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'style-table',
        icon: 'icon-table',
        label: '表格样式',
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'cell-table',
        icon: 'icon-table',
        label: '单元格',
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'cell-background-table',
        icon: 'icon-table',
        label: '单元格背景',
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'cell-style-table',
        icon: 'icon-table',
        label: '单元格样式',
        parent: EDITOR_TABLE_TOOL, 
    },
    {
        name: 'horizontal-table',
        icon: 'icon-shuipingdengjianju',
        label: '横向',
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.insert({type: EditorBlockType.ColSpan});
        },
    },
    {
        name: 'vertical-table',
        icon: 'icon-chuizhidengjianju',
        label: '纵向',
        parent: EDITOR_TABLE_TOOL, 
        handler(editor) {
            editor.insert({type: EditorBlockType.RowSpan});
        },
    },
    // 链接处理

    {
        name: 'open-link',
        icon: 'icon-paper-plane',
        label: '打开链接',
        parent: EDITOR_LINK_TOOL, 
        handler(editor) {
            editor.insert({type: EditorBlockType.OpenLink});
        },
    },
    {
        name: 'link-style',
        icon: 'icon-font-foreground',
        label: '更改样式',
        parent: EDITOR_LINK_TOOL, 
    },
    {
        name: 'edit-link',
        icon: 'icon-edit',
        label: '编辑链接',
        parent: EDITOR_LINK_TOOL, 
    },
    {
        name: 'unlink',
        icon: 'icon-chain-broken',
        label: '断开链接',
        parent: EDITOR_LINK_TOOL, 
    },
];