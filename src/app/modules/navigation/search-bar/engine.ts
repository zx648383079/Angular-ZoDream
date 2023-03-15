import { eachObject } from '../../../theme/utils';

type SearchSuggestFunc = (this: ISearchBar, keywords: string, cb: (data: string[]) => void) => void;

export interface ISearchEngine {
    name: string,
    icon: string,
    url: string,
    suggest?: string | SearchSuggestFunc
}

export interface ISearchBar {
    jsonp(url: string, cb: Function, cbName?: string): void;

}

function pluck(data: any, key: string): string[] {
    let args = [];
    if (!data) {
        return args;
    }
    eachObject(data, val => {
        if (val[key]) {
            args.push(val[key]);
        }
    });
    return args;
}

export const SearchEngineItems: ISearchEngine[] = [
    {
        name: $localize `Baidu`,
        icon: 'icon-baidu',
        url: 'https://www.baidu.com/s?wd={word}',
        suggest: function(keywords, cb) {
            this.jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + keywords, res => {
                cb(res ? res.s : []);
            })
        },
    },
    {
        name: 'Bing',
        icon: 'icon-bing',
        url: 'https://cn.bing.com/search?q={word}',
    },
    {
        name: 'Google',
        icon: 'icon-google',
        url: 'https://www.google.com/search?q={word}',
    },
    {
        name: 'DuckDuckGo',
        icon: 'icon-duckduckgo',
        url: 'https://duckduckgo.com/?q={word}',
        suggest: function(keywords, cb) {
            this.jsonp('https://duckduckgo.com/ac/?q=' + keywords, res => {
                cb(pluck(res, 'phrase'));
            }, 'callback');
        },
    },
    {
        name: 'Github',
        icon: 'icon-github',
        url: 'https://github.com/search?utf8=✓&q={word}',
    },
]