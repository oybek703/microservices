import React, { useState } from 'react'
import axios from 'axios'

const CommentCreate = ({postId}) => {
    const [content, setContent] = useState('')
    async function handleSubmit (event) {
        event.preventDefault()
        if (!content) return
        await axios.post(`http://posts.com/posts/${postId}/comments`, {content})
        setContent('')
    }
    return (
        <div className='mt-3'>
            <div className='card-body'>
                <h6 className='font-monospace'>New comment</h6>
                <form action="/" onSubmit={handleSubmit}>
                    <input value={content} onChange={event => setContent(event.target.value)}
                           placeholder='Add comment...'
                           type="text" className='form-control'/>
                </form>
            </div>
        </div>
    )
}

export default CommentCreate
