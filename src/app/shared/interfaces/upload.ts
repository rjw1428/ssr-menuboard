export class Upload {
    id?: string
    file?: File
    progress?: number
    displayName: string
    dateAdded: string = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    fbUrl?: string
    sourceUrl: string

    constructor(file: File) {
        this.file = file
    }
}
