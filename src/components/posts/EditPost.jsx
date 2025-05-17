import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPost, updatePost } from '../../services/posts'

function EditPost() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id)
        setTitle(data.title)
        setBody(data.body)
        // If the post has an image, set the current image URL
        if (data.image_url) {
          setCurrentImage(data.image_url)
        }
      } catch (err) {
        setError('Failed to fetch post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]
    if (selectedImage) {
      // Preview the selected image
      setImage(selectedImage)
      setCurrentImage(URL.createObjectURL(selectedImage))
      setRemoveImage(false)  // Reset remove flag if a new image is selected
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !body) {
      return setError('Please fill in all fields')
    }

    try {
      setSaving(true)

      // Create a FormData object to handle file upload
      const formData = new FormData()
      formData.append('post[title]', title)
      formData.append('post[body]', body)

      // Append image if a new image is selected
      if (image) {
        formData.append('post[image]', image)
      }

      // Add flag to remove image if removeImage is true
      if (removeImage) {
        formData.append('post[remove_image]', 'true')
      }

      await updatePost(id, formData)
      navigate(`/posts/${id}`)
    } catch (err) {
      setError('Failed to update post')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setCurrentImage(null)
    setRemoveImage(true)  // Set the flag to indicate image should be removed
  }

  if (loading) return <div>Loading post...</div>

  return (
    <div className="container mx-auto max-w-lg mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Edit Post</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

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

        <div className="mb-4">
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

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          {currentImage && !removeImage && (
            <div className="mt-4 relative">
              <img
                src={currentImage}
                alt="Post"
                className="max-w-full h-auto rounded"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost