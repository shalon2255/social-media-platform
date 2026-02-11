import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import MyPostDetail from './pages/MyPostDetail'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import Search from './pages/Search'
import AdminLayout from './admin/pages/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminUsers from './admin/pages/AdminUsers'
import AdminPosts from './admin/pages/AdminPosts'
import AdminActivity from './admin/pages/AdminActivity'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
<Routes>
     <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />}/>
         <Route element={<ProtectedRoute> <MainLayout /></ProtectedRoute>}>
          <Route path="/feed" element={<Feed/>} />
           <Route path="/create" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mypost/:id" element={<MyPostDetail />} />
            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/search" element={<Search/>} />
      </Route>
        <Route path="/admin" element={<AdminLayout/> }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="activity" element={<AdminActivity/>} />
        <Route path="posts" element={<AdminPosts />} />

</Route>
           
           
      </Routes>
    </BrowserRouter>
  )
}

export default App
