export interface ExampleItem {
    swe: string;
    arb: string;
}

export interface ContentItem {
    type: string;
    html: string;
}

export interface LessonSection {
    title: string;
    content: ContentItem[];
    examples: ExampleItem[];
}

export interface Lesson {
    id: string;
    title: string;
    level: string;
    sections: LessonSection[];
}

export interface LessonCardProps {
    lesson: Lesson;
    isCompleted: boolean;
    onClick: (lesson: Lesson) => void;
}
