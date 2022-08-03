import React from 'react'

const CommentList = ({comments}) => {
  return (
      <div className='card-body'>
        <h3>Comments</h3>
        <ul className='mt-2'>
          {
            !comments.length
                ? <i>No comments yet...</i>
                : comments.map(({id, content, status}) => <li key={id}>
                  {status === 'rejected'
                      ? 'This comment is rejected.'
                      : status === 'pending'
                          ? 'This comment is in pending status.'
                          : content}
                </li>)
          }
        </ul>
      </div>
  )
}

export default CommentList
