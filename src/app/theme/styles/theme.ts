type Color = 'transparent'|string;
type Shadow = string;
export interface ThemeOption {
    /**
     * 主题名称
     */
    name: string;

    primary: Color;
    primaryText: Color;
    secondary: Color;
    secondaryText: Color;

    body: Color;
    bodyText: Color;

    hover: Color;
    hoverText: Color;

    active: Color;
    activeText: Color;

    dialog: Color;
    dialogText: Color;

    button: Color;
    buttonText: Color;
    buttonBorder: Color;
    buttonHoverBorder:  Color;

    linkText: Color;

    shadow: Color;
    disable: Color;

    input: Color;
    inputTextIcon: Color;
    inputText: Color;
    inputLabel: Color;
    inputBorder: Color;
    inputFocusBorder: Color;
    inputFocusShadow: Shadow;
}