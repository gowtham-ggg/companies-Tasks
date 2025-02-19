import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [sortBy, setSortBy] = useState("recent")
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/posts`)
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const addPost = async (newPost) => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.post(`${backendUrl}/api/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts([data, ...posts])
    } catch (error) {
      console.error("Error adding post:", error)
    }
  }

  const addComment = async (postId, comment) => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.post(
        `${backendUrl}/api/posts/comment/${postId}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, comments: data.comments } : post
      ))
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  
  const sortedPosts = [...posts].sort((a, b) => 
    sortBy === "popular" 
      ? b.likes.length - a.likes.length 
      : new Date(b.createdAt) - new Date(a.createdAt)
  )
  useEffect(() => { fetchPosts() }, [])

  return (
    <PostContext.Provider value={{ 
      posts: sortedPosts, 
      addPost, 
      addComment,
      setSortBy,
      fetchPosts
    }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePosts = () => useContext(PostContext)