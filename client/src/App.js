import React from 'react'
import PostCreate from './components/PostCreate'
import PostList from './components/PostList'

const App = () => {
    return (
        <div className='container card mt-2'>
            <PostCreate/>
            <PostList/>
        </div>
    )
}

export default App
