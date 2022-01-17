import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'Jonathan Yun will help you',

    slash: 'both',
    testOnly: true,

    callback: ({}) => {
        return "bro idk how to help you"
    },
} as ICommand
