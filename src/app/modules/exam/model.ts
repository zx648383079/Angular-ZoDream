import { IUser } from '../../theme/models/user';

export const QuestionTypeItems = ['单选题', '多选题', '判断题', '简答题', '填空题', '大题'];
export const QuestionDefaultOption = [
    {content: '', is_right: false},
    {content: '', is_right: false}
];
export const QuestionCheckOption = [
    {content: '对', is_right: false},
    {content: '错', is_right: false}
];

export interface IQuestion {
    id: number;
    title: string;
    image:      string;
    course_id:  number;
    course_grade?: number;
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
    editable?: boolean;
    children?: IQuestion[];
    parent?: IQuestion;
    course_grade_format?: string;
}

export interface IQuestionMaterial {
    id?: number;
    course_id?: number;
    title: string;
    description: string;
    type: number;
    content: string;
    question_count?: number;
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
    log?: IQuestionEvaluate;
}

export interface IQuestionCard {
    order: string;
    id: number;
    right: number;
    active: boolean;
    page?: number;
}

export interface IQuestionPageItem {
    page: number;
    material?: IQuestion;
    items: IQuestionFormat[];
}

export interface IQuestionOption {
    id?:       number;
    order?: string;
    content:     string;
    question_id?: number;
    type?:        number;
    is_right:    boolean;
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
    question_count?: number;
}

export interface IExamPage {
    id: number;
    name: string;
    course_id:  number;
    course_grade?: number;
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
    question_count?: number;
    score?: number;
    course_grade_format?: string;
    course?: ICourse;
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
    page?: IExamPage;
    data?: IQuestionFormat[];
}

export interface IQuestionEvaluate {
    id: number;
    answer: string;
    status: number;
    score: number;
    max_score: number;
    remark: string;
}

export interface IExamSheet {
    id?: number;
    answer: any;
    dynamic: string;
}

export interface IExamPager {
    id: number;
    page_id: number;
    title: string;
    time: number;
    start_time: number;
    finished: boolean;
    data: IQuestionFormat[];
    report?: {
        wrong: number;
        right: number;
        scale: number;
    };
}