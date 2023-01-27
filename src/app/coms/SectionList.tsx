export interface Section {
    caption: string;
    items: string[];
}

export interface SectionListProps {
    sections: Section[];
    cnContainer?: string;
    cnTitleContainer?: string;
    cnTitle?: string;
    cnListContainer?: string;
    cnListItem?: string;
}

const cnDefault = {
    defContainer: 'px-3 my-2 bg-white',
    defTitleContainer: 'my-3',
    defTitle: 'my-2',
    defListContainer: 'px-3 text-dark',
    defListItem: '',
}

export function SectionList({ sections, cnContainer, cnTitleContainer, cnTitle, cnListContainer, cnListItem }: SectionListProps) {
    const { defContainer, defTitleContainer, defTitle, defListContainer, defListItem } = cnDefault;
    return <ul className={cnContainer ?? defContainer}>
        {
            sections.map((v, index) => {
                const { caption, items } = v;
                return <li key={index} className={cnTitleContainer ?? defTitleContainer}>
                    <div className={cnTitle ?? defTitle}>{caption}</div>
                    <ol className={cnListContainer ?? defListContainer}>
                        {items.map((item, index) => {
                            return <li key={index} className={cnListItem ?? defListItem}>{item}</li>
                        })}
                    </ol>
                </li>;
            })
        }
    </ul>;
}
