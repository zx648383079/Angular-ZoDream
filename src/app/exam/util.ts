import { IQuestion } from './model';

export const questionNeedOption = (value: IQuestion) => {
    return !value.type || value.type < 2 || value.type == 4;
}