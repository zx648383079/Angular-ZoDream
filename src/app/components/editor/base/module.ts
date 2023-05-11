import { EditorColorComponent } from '../modal/color/editor-color.component';
import { EditorDropdownComponent } from '../modal/dropdown/editor-dropdown.component';
import { EditorFileComponent } from '../modal/file/editor-file.component';
import { EditorImageComponent } from '../modal/image/editor-image.component';
import { EditorLinkComponent } from '../modal/link/editor-link.component';
import { EditorTableComponent } from '../modal/table/editor-table.component';
import { EditorVideoComponent } from '../modal/video/editor-video.component';
import { EditorBlockType } from '../model';
import { EDITOR_ADD_TOOL, EDITOR_CLOSE_TOOL, EDITOR_ENTER_TOOL } from './event';
import { IEditorModule } from './option';

export const EditorModules: IEditorModule[] = [
    {
        name: 'text',
        icon: 'icon-char',
        label: '编辑文字',
    },
    {
        name: 'paragraph',
        icon: 'icon-paragraph',
        label: '编辑段落',
    },
    {
        name: EDITOR_ADD_TOOL,
        icon: 'icon-plus',
        label: '添加内容',
    },
    {
        name: 'undo',
        icon: 'icon-undo',
        label: '撤回',
        hotKey: 'Ctrl+Z',
        handler(editor) {
            editor.undo();
        }
    },
    {
        name: 'redo',
        icon: 'icon-redo',
        label: '重做',
        hotKey: 'Ctrl+Shift+Z',
        handler(editor) {
            editor.redo();
        }
    },
    {
        name: 'more',
        icon: 'icon-ellipsis-v',
        label: '更多'
    },
    {
        name: EDITOR_CLOSE_TOOL,
        icon: 'icon-close',
        label: '关闭'
    },

    {
        name: EDITOR_ENTER_TOOL,
        icon: 'icon-enter',
        label: '换行',
        handler(editor) {
            editor.insertBlock({type: EditorBlockType.AddLineBreak});
        }
    },
    // 文字处理
    {
        name: 'bold',
        icon: 'icon-bold',
        label: '加粗',
        parent: 'text',
    },
    {
        name: 'italic',
        icon: 'icon-italic',
        label: '倾斜',
        parent: 'text',
    },
    {
        name: 'underline',
        icon: 'icon-underline',
        label: '下划线',
        parent: 'text',
    },
    {
        name: 'strike',
        icon: 'icon-strike',
        label: '画线',
        parent: 'text',
    },
    {
        name: 'sub',
        icon: 'icon-sub',
        label: '下标',
        parent: 'text',
    },
    {
        name: 'sup',
        icon: 'icon-sup',
        label: '上标',
        parent: 'text',
    },
    {
        name: 'fontsize',
        icon: 'icon-font-size',
        label: '字体大小',
        parent: 'text',
        modal: EditorDropdownComponent,
    },
    {
        name: 'font',
        icon: 'icon-pencil',
        label: '字体',
        parent: 'text',
        modal: EditorDropdownComponent,
    },
    {
        name: 'foreground',
        icon: 'icon-font-foreground',
        label: '字体颜色',
        parent: 'text',
        modal: EditorColorComponent,
    },
    {
        name: 'background',
        icon: 'icon-editor-background-color',
        label: '背景颜色',
        parent: 'text',
        modal: EditorColorComponent,
    },
    {
        name: 'clear',
        icon: 'icon-clearformat',
        label: '清除样式',
        parent: 'text',
    },

    // 段落处理
    {
        name: 'align-left',
        icon: 'icon-alignleft',
        label: '居左',
        parent: 'paragraph',
    },
    {
        name: 'align-center',
        icon: 'icon-aligncenter',
        label: '居中',
        parent: 'paragraph',
    },
    {
        name: 'align-right',
        icon: 'icon-alignright',
        label: '居右',
        parent: 'paragraph',
    },
    {
        name: 'align-justify',
        icon: 'icon-alignjustify',
        label: '铺满',
        parent: 'paragraph',
    },
    {
        name: 'list',
        icon: 'icon-orderedlist',
        label: '列表',
        parent: 'paragraph',
    },
    {
        name: 'indent',
        icon: 'icon-indent',
        label: '缩进',
        parent: 'paragraph',
    },
    {
        name: 'outdent',
        icon: 'icon-outdent',
        label: '取消缩进',
        parent: 'paragraph',
    },
    {
        name: 'blockquote',
        icon: 'icon-blockquote',
        label: '添加引用',
        parent: 'paragraph',
    },


    // 添加
    {
        name: 'link',
        icon: 'icon-chain',
        label: '添加链接',
        parent: EDITOR_ADD_TOOL,
        modal: EditorLinkComponent,
    },
    {
        name: 'image',
        icon: 'icon-image',
        label: '添加图片',
        parent: EDITOR_ADD_TOOL,
        modal: EditorImageComponent,
    },
    {
        name: 'video',
        icon: 'icon-file-movie-o',
        label: '添加视频',
        parent: EDITOR_ADD_TOOL,
        modal: EditorVideoComponent,
    },
    {
        name: 'table',
        icon: 'icon-table',
        label: '添加表格',
        parent: 'add',
        modal: EditorTableComponent,
    },
    {
        name: 'file',
        icon: 'icon-file-o',
        label: '添加文件',
        parent: EDITOR_ADD_TOOL,
        modal: EditorFileComponent,
    },
    {
        name: 'line',
        icon: 'icon-minus',
        label: '添加横线',
        parent: EDITOR_ADD_TOOL,
        handler(editor) {
            editor.insertBlock({type: EditorBlockType.AddHr});
        }
    },

    // 更多
    {
        name: 'full-screen',
        icon: 'icon-full-screen',
        label: '全屏',
        parent: 'more',
    },
    {
        name: 'select-all',
        icon: 'icon-selectall',
        label: '全选',
        parent: 'more',
    },
    {
        name: 'code',
        icon: 'icon-code',
        label: '查看代码',
        parent: 'more',
    },

    // 图片处理
    {
        name: 'replace-image',
        icon: 'icon-exchange',
        label: '替换',
        parent: 'image-edit', 
    },
    {
        name: 'align-image',
        icon: 'icon-alignright',
        label: '位置',
        parent: 'image-edit', 
    },
    {
        name: 'caption-image',
        icon: 'icon-image',
        label: '图片标题',
        parent: 'image-edit', 
    },
    {
        name: 'delete-image',
        icon: 'icon-trash',
        label: '删除图片',
        parent: 'image-edit', 
    },
    {
        name: 'link-image',
        icon: 'icon-chain',
        label: '插入链接',
        parent: 'image-edit', 
    },
    {
        name: 'alt-image',
        icon: 'icon-char',
        label: '图片备注',
        parent: 'image-edit', 
    },
    {
        name: 'size-image',
        icon: 'icon-ruler',
        label: '调整尺寸',
        parent: 'image-edit', 
    },
    
    // 视频处理
    {
        name: 'replace-video',
        icon: 'icon-exchange',
        label: '替换',
        parent: 'video-edit', 
    },
    {
        name: 'align-video',
        icon: 'icon-alignright',
        label: '位置',
        parent: 'video-edit', 
    },
    {
        name: 'caption-video',
        icon: 'icon-film',
        label: '视频标题',
        parent: 'video-edit', 
    },
    {
        name: 'delete-video',
        icon: 'icon-trash',
        label: '删除视频',
        parent: 'video-edit', 
    },
    {
        name: 'size-video',
        icon: 'icon-ruler',
        label: '调整尺寸',
        parent: 'video-edit', 
    },

    // 表格处理

    {
        name: 'header-table',
        icon: 'icon-table',
        label: '表头',
        parent: 'table-edit', 
    },
    {
        name: 'footer-table',
        icon: 'icon-table',
        label: '表尾',
        parent: 'table-edit', 
    },
    {
        name: 'delete-table',
        icon: 'icon-trash',
        label: '删除表格',
        parent: 'table-edit', 
    },
    {
        name: 'row-table',
        icon: 'icon-table',
        label: '行',
        parent: 'table-edit', 
    },
    {
        name: 'column-table',
        icon: 'icon-table',
        label: '列',
        parent: 'table-edit', 
    },
    {
        name: 'style-table',
        icon: 'icon-table',
        label: '表格样式',
        parent: 'table-edit', 
    },
    {
        name: 'cell-table',
        icon: 'icon-table',
        label: '单元格',
        parent: 'table-edit', 
    },
    {
        name: 'cell-background-table',
        icon: 'icon-table',
        label: '单元格背景',
        parent: 'table-edit', 
    },
    {
        name: 'cell-style-table',
        icon: 'icon-table',
        label: '单元格样式',
        parent: 'table-edit', 
    },
    {
        name: 'horizontal-table',
        icon: 'icon-shuipingdengjianju',
        label: '横向',
        parent: 'table-edit', 
    },
    {
        name: 'vertical-table',
        icon: 'icon-chuizhidengjianju',
        label: '纵向',
        parent: 'table-edit', 
    },
    // 链接处理

    {
        name: 'open-link',
        icon: 'icon-paper-plane',
        label: '打开链接',
        parent: 'link-edit', 
    },
    {
        name: 'link-style',
        icon: 'icon-font-foreground',
        label: '更改样式',
        parent: 'link-edit', 
    },
    {
        name: 'edit-link',
        icon: 'icon-edit',
        label: '打开链接',
        parent: 'link-edit', 
    },
    {
        name: 'unlink',
        icon: 'icon-chain-broken',
        label: '断开链接',
        parent: 'link-edit', 
    },
];