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
    analysis:   string;
    updated_at: string;
    created_at: string;
    course?: ICourse;
    option?: IQuestionOption[];
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
    question_id: string;
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
        course: number;
        type: {
            [key: number]: number;
        }
    }[];
}

export interface IExamPager {
    finished: boolean;
    data: IQuestionFormat[];
    report?: {
        wrong: number;
        right: number;
        scale: number;
    };
}