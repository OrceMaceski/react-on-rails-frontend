import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../../services/posts'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(['Invalid file type. Please upload a JPEG, PNG, or GIF.'])
        return
      }

      if (file.size > maxSize) {
        setErrors(['File is too large. Maximum size is 5MB.'])
        return
      }

      setImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      setErrors([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !body) {
      return setErrors(['Please fill in all required fields'])
    }

    try {
      setLoading(true)
      setErrors([])

      const formData = new FormData()
      formData.append('post[title]', title)
      formData.append('post[body]', body)

      if (image) {
        formData.append('post[image]', image)
      }

      await createPost(formData)
      navigate('/posts')
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(err)
      } else {
        setErrors([err.message || 'Failed to create post'])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
            Content
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post content"
            rows="10"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Post Image (Optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-64 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/posts')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost