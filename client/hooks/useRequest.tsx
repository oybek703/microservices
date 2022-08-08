import React, {useState} from 'react'
import axios, {AxiosError, Method} from 'axios'
import set = Reflect.set

interface UseRequestParams {
    url: string
    method: Method
    body?: any
    onSuccess?(responseData: object): void
}

function useRequest ({url, method, body, onSuccess }: UseRequestParams) {
    const [errors, setErrors] = useState(null)
    async function makeRequest() {
        try {
            setErrors([])
            const {data} = await axios[method](url, body)
            if(onSuccess) onSuccess(data)
        } catch (e: any) {
            console.log(e)
            const errors = <div className='alert alert-danger'>
                <h4>Error...</h4>
                <ul>
                    {e.response.data.errors.map(error => <li key={error.message}>
                        {error.message}
                    </li>)}
                </ul>
            </div>
            setErrors(errors)
        }
    }
    return {makeRequest, errors}
}

export default useRequest