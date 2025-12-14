import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { emptyValidate } from '../../../../../theme/validators';
import { BotService } from '../../bot.service';
import { ThemeService } from '../../../../../theme/services';
import { NavigationDisplayMode } from '../../../../../theme/models/event';

@Component({
    standalone: false,
    selector: 'app-bot-edit-news',
    templateUrl: './edit-news.component.html',
    styleUrls: ['./edit-news.component.scss']
})
export class EditNewsComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public data: any = {
        title: '',
        parent_id: 0,
        type: 'news',
        content: '',
        show_cover: 0,
        only_comment: 0,
        open_comment: 0,
    };
    public onlyItems = ['所有人', '粉丝'];
    public requestUrl = 'wx/admin/media/search?type=news';

    ngOnInit() {
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Compact);
        this.requestUrl += '&wid=' + this.service.baseId;
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.media(params.id).subscribe({
                next: res => {
                    this.data = res;
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            })
        });
    }

    ngOnDestroy(): void {
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emptyValidate(this.data.title)) {
            this.toastrService.error('请输入标题');
            return;
        }
        if (emptyValidate(this.data.content)) {
            this.toastrService.error('请输入内容');
            return;
        }
        this.service.mediaSave(this.data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
                history.back();
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }

}
