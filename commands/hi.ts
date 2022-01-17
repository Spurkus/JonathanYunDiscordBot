import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'Jonathan Yun says hi back',

    slash: 'both',
    testOnly: true,

    callback: ({}) => {
        return "Hello, I'm Jonathan Yun"
    },
} as ICommand
