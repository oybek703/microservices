export const natsWrapper = {
    client: {
        publish: jest.fn(function (subject: string, data: string, callback: () => void ) {
            callback()
        })
    }
}