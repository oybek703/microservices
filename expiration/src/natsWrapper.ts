import {connect, Stan} from 'node-nats-streaming'

class NatsWrapper {
    private _client?: Stan

    get client() {
        if(!this._client) throw new Error('Cannot access NATS before connecting!')
        return this._client
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = connect(clusterId, clientId, {url})
        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', function () {
                console.log('Connected to NATS!')
                resolve()
            })
            this.client.on('error', function (err) {
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper()