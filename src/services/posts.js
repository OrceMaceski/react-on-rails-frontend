import api from './api'

export const getPosts = async (page = 1) => {
  try {
    const response = await api.get(`/posts?page=${page}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch posts')
  }
}

export const getPost = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch post')
  }
}

export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    if (error.response?.data && typeof error.response.data === 'object') {
      const formattedErrors = []

      Object.entries(error.response.data).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            formattedErrors.push(`${field} ${message}`)
          })
        } else if (typeof messages === 'string') {
          formattedErrors.push(`${field} ${messages}`)
        }
      })

      if (formattedErrors.length > 0) {
        throw formattedErrors
      }
    }

    throw new Error(error.response?.data?.error || 'Failed to create post')
  }
}

export const updatePost = async (id, postData) => {
  if (postData instanceof FormData) {
    return await api.put(`/posts/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return await api.put(`/posts/${id}`, postData)
}

export const deletePost = async (id) => {
  try {
    await api.delete(`/posts/${id}`)
    return { success: true }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete post')
  }
}