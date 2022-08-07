import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function ({Component, pageProps}) {
    return <div className='container mt-3'>
        <Component {...pageProps}/>
    </div>
}