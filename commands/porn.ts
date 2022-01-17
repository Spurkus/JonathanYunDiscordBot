import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'gives you good porn',

    slash: 'both',
    testOnly: true,

    callback: ({}) => {
        const pornImage = ('||https://i.imgur.com/E7fHQGR.png||')
        return pornImage
    },
} as ICommand
