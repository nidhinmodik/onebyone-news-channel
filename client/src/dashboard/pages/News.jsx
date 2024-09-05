import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import NewContent from '../components/NewContent'
import storeContext from '../../context/storeContext';

const News = () => {

    const { store } = useContext(storeContext)

    return (
        <div className='bg-white rounded-md'>
            <div className='flex justify-between p-4'>
                <h2 className='text-x1 font-medium'>News</h2>
                {
                    store.userInfo && (store.userInfo.role !== 'admin' || store.userInfo.role === 'superadmin') && (
                        <Link className='px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600' to='/dashboard/news/create'>
                            Create News
                        </Link>
                    )
                }
            </div>
            <NewContent />
        </div>
    )
}

export default News