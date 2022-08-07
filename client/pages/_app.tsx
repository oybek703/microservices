import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import App, {AppContext, AppInitialProps, AppProps} from 'next/app'
import buildClient from '../api/buildClient'
import Header from '../component/Header'


export interface ICurrentUser {
    id: string
    email: string
}

export type TCurrentUser = ICurrentUser | null

type AppComponentProps = { currentUser: TCurrentUser }

function AppComponent({Component, pageProps, currentUser}: AppProps & AppComponentProps) {
    return <>
        <Header currentUser={currentUser}/>
        <div className='container'>
            <Component {...pageProps}/>
        </div>
    </>
}

AppComponent.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps> => {
    const client = await buildClient({req: appContext.ctx.req})
    const {data} = await client.get('/api/users/currentUser')
    const ctx = await App.getInitialProps(appContext)
    return {...ctx, ...data}
}

export default AppComponent