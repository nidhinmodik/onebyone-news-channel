import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'

const AddAdvertiser = () => {

  const navigate = useNavigate()
  const { store } = useContext(storeContext)
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    company: "" // Changed from category to company
  })

  const inputHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const [loader, setLoader] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_url}/api/news/advertiser/add`, state, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
      setLoader(false)
      toast.success(data.message)
      navigate('/dashboard/advertisers') // Changed path to advertisers
    } catch (error) {
      setLoader(false)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='bg-white rounded-md'>
      <div className='flex justify-between p-4'>
        <h2 className='text-xl font-medium'>Add Advertiser</h2>
        <Link className='px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600' to='/dashboard/advertisers'>Advertisers</Link> {/* Changed text and link */}
      </div>
      <div className='p-4'>
        <form onSubmit={submit}>
          <div className='grid grid-cols-2 gap-x-8 mb-3'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="name">Name</label>
              <input onChange={inputHandler} value={state.name} required type="text" placeholder='name' name='name' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10' id='name' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="company">Company</label> {/* Changed label from category to company */}
              <input onChange={inputHandler} value={state.company} required type="text" placeholder='company' name='company' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10' id='company' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-x-8 mb-3'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="email">Email</label>
              <input onChange={inputHandler} value={state.email} required type="text" placeholder='email' name='email' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10' id='email' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <div className='flex flex-col gap-y-2'>
                <label className='text-md font-medium text-gray-600' htmlFor="password">Password</label>
                <input onChange={inputHandler} value={state.password} required type="password" placeholder='password' name='password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-blue-500 h-10' id='password' />
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <button disabled={loader} className='px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600' >{loader ? 'Loading...' : 'Add Advertiser'}</button> {/* Changed button text */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAdvertiser;