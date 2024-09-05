import { useContext, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from './dashboard/layout/MainLayout';
import AdminIndex from './dashboard/pages/AdminIndex';
import Login from './dashboard/pages/Login';
import ProtectDashboard from './middleware/ProtectDashboard';
import ProtectRole from './middleware/ProtectRole';
import Unable from './dashboard/pages/Unable';
import Writers from './dashboard/pages/Writers';
import AddWriter from './dashboard/pages/AddWriter';
import News from './dashboard/pages/News';
import Advertisement from './dashboard/pages/Advertisement';
import Profile from './dashboard/pages/Profile';
import WriterIndex from './dashboard/pages/WriterIndex';
import AdverticementIndex from './dashboard/pages/AdverticementIndex';
import CreateNews from './dashboard/pages/CreateNews';
import CreateAdvertisement from './dashboard/pages/CreateAdvertisement';
import AddAdvertiser from './dashboard/pages/AddAdvertiser';
import Advertiser from './dashboard/pages/Advertiser';
import Edit_news from './dashboard/pages/Edit_news';
import AddAdmin from './dashboard/pages/AddAdmin';
import SuperAdminIndex from './dashboard/pages/SuperAdminIndex';
import Admins from './dashboard/pages/Admins';
import storeContext from './context/storeContext';



function App() {

  const { store } = useContext(storeContext)
  console.log(store.userInfo.role);
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectDashboard />} >
          <Route path='' element={<MainLayout />}>
            <Route
              path=''
              element={
                store.userInfo?.role === 'admin' ? (
                  <Navigate to='/dashboard/admin' />
                ) :userInfo.role === 'superadmin' ? (
                  <Navigate to='/dashboard/superadmin' />
                ) : userInfo.role === 'writer' ? (
                  <Navigate to='/dashboard/writer' />
                ) : (
                  <Navigate to='/dashboard/advertiser' />
                )
              }
            />
            <Route path='unable-access' element={<Unable />} />
            <Route path='news' element={<News />} />
            <Route path='profile' element={<Profile />} />
            <Route path='advertisement' element={<Advertisement />} />
            <Route path='writers' element={<Writers />} />
            <Route path='advertisers' element={<Advertiser />} />

            <Route path='' element={<ProtectRole role={'superadmin'}/>} >
            <Route path='superadmin' element={<SuperAdminIndex />} />
              <Route path='admin/add' element={<AddAdmin/>} />
              <Route path='admins' element={<Admins/>} />
            </Route>

            <Route path='' element={<ProtectRole role={'admin'} />} >
              <Route path='admin' element={<AdminIndex />} />
              <Route path='writer/add' element={<AddWriter />} />
              <Route path='advertiser/add' element={<AddAdvertiser />} />
            </Route>

            <Route path='' element={<ProtectRole role={'writer'} />} >
              <Route path='writer' element={<WriterIndex />} />
              <Route path='news/create' element={<CreateNews />} />
              <Route path='news/edit/:news_id' element={<Edit_news />} />
            </Route>

            <Route path='' element={<ProtectRole role={'advertiser'} />} >
              <Route path='advertiser' element={<AdverticementIndex />} />
              <Route path='advertisement/create' element={<CreateAdvertisement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App