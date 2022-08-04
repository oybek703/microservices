import React, { useState } from 'react'
import axios from 'axios'

const PostCreate = () => {
    const [title, setTitle] = useState('')
    async function handleSubmit (event) {
        event.preventDefault()
        if (!title) return
        await axios.post('http://posts.com/posts/create', {title})
        setTitle('')
    }
    return (
        <div className='mt-3'>
            <div className='card-body'>
                <h2 className='font-monospace'>Create Post</h2>
                <form action="/" onSubmit={handleSubmit}>
                    <input value={title} onChange={event => setTitle(event.target.value)}
                        placeholder='Post title...'
                           type="text" className='form-control'/>
                </form>
            </div>
        </div>
    )
}

export default PostCreate
