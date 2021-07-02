import { IUser } from '../theme/models/user';

export interface IQuestion {
    id: number;
    title: string;
    image:      string;
    course_id:  number;
    parent_id:  number;
    type:       number;
    easiness:   number;
    content:    string;
    dynamic:    string;
    answer:     any;
    material_id?: number;
    material?: IQuestionMaterial;
    analysis_items?:  IQuestionAnalysis[];
    analysis?: string;
    updated_at: string;
    created_at: string;
    course?: ICourse;
    option_items?: IQuestionOption[];
    option?: IQuestionOption[];
    score?: number;
}

export interface IQuestionMaterial {
    id?: number;
    course_id?: number;
    title: string;
    description: string;
    type: number;
    content: string;
}

export interface IQuestionAnalysis {
    id?: number;
    question_id?: number;
    type: number;
    content: string;
}

export interface IQuestionFormat extends IQuestion {
    order: string;
    right: number;
    your_answer: any;
}

export interface IQuestionCard {
    order: string;
    id: number;
    right: number;
    active: boolean;
}

export interface IQuestionOption {
    id:          string;
    order: string;
    content:     string;
    question_id: number;
    type:        string;
    is_right:    string;
    checked?: boolean;
}


export interface ICourse {
    id: number;
    name: string;
    thumb: string;
    description: string;
    parent_id: number;
    level?: number;
    children?: ICourse[];
}

export interface IExamPage {
    id: number;
    name: string;
    rule_type: number;
    limit_time: number;
    start_at: string;
    end_at: string;
    rule_value: {
        id: number;
        score: number;
    }[]|{
        course: number;
        type: number;
        score: number;
    }[];
}

export interface IPageEvaluate {
    id: number;
    user: IUser;
    spent_time: number;
    right: number;
    wrong: number;
    score: number;
    status: number;
    remark: string;
    updated_at: string;
    created_at: string;
}

export interface IExamSheet {
    id?: number;
    answer: any;
    dynamic: string;
}

export interface IExamPager {
    id: number;
    title: string;
    time: number;
    finished: boolean;
    data: IQuestionFormat[];
    report?: {
        wrong: number;
        right: number;
        scale: number;
    };
}