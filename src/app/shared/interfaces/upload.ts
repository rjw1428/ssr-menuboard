export class Upload {
    key: string
    file: File
    progress: number
    name: string
    dateAdded: string = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    url: string

    constructor (file: File) {
        this.file = file
    }
}
