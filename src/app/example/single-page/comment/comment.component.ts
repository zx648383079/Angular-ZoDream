import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { email, form, required } from '@angular/forms/signals';
import { interval } from 'rxjs';


interface ICommentItem {
    content: string;
    agreeType: number;
    agreeCount: number;
}

@Component({
    standalone: false,
    selector: 'app-example-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class ExampleCommentComponent {

    private readonly destroyRef = inject(DestroyRef);

    public readonly items = signal<ICommentItem[]>([]);
    public readonly commentForm = form(signal({
        content: '',
        name: '',
        email: '',
        url: '',
    }), schemaPath => {
        required(schemaPath.content, {message: 'Comment is required.'});
        required(schemaPath.name, {message: 'Nickname is required.'});
        email(schemaPath.email, {message: 'Email is invalid.'});
    });

    public readonly positiveScale = computed(() => {
        const items = this.items();
        if (items.length === 0) {
            return 0;
        }
        return items.filter(i => i.agreeType === 1).length * 100 / items.length;
    });
    public readonly negativeScale = computed(() => {
        const items = this.items();
        if (items.length === 0) {
            return 0;
        }
        return items.filter(i => i.agreeType === 2).length * 100 / items.length;
    });
    public readonly vsItems = computed(() => {
        return this.items().filter(i => i.agreeType > 0);
    });
    public readonly commentItems = computed(() => {
        return this.items().filter(i => i.agreeType === 0);
    });

    constructor() {
        const timer$ = interval(2000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (this.items().length > 100) {
                timer$.unsubscribe();
                return;
            }
            const rnd = Math.random();
            this.items.update(v => {
                return [...v, rnd >= .5 ? {
                    content: '说的不对。',
                    agreeType: 2,
                    agreeCount: 0
                } : {
                    content: '说的对。',
                    agreeType: 1,
                    agreeCount: 0
                }];
            });
        });
    }


    public tapSubmit(e: Event) {
        e.preventDefault();
        if (this.commentForm().invalid()) {
            return;
        }
        const data = this.commentForm().value();
        this.items.update(v => {
            return [...v, {
                content: data.content,
                agreeType: this.getAgreeType(data.content),
                agreeCount: 0
            }];
        });
        this.commentForm.content().value.set('');
    }

    private getAgreeType(val: string) {
        const words = ['dislike', 'disagree', 'unsupport', '不支持', '不同意', '不赞同',
                        'like', 'agree', 'support', '支持', '同意', '赞同'];
        for (const word of words) {
            const i = val.indexOf(word);
            if (i >= 0) {
                return i < words.length / 2 ? 2 : 1;
            }
        }
        return 0;
    }

}
