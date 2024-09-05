import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AdContent from '../components/AdContent'; // Assuming you have a component to display advertisement content
import storeContext from '../../context/storeContext';

const Advertisement = () => {

    const { store } = useContext(storeContext);

    return (
        <div className='bg-white rounded-md'>
            <div className='flex justify-between p-4'>
                <h2 className='text-xl font-medium'>Advertisements</h2>
                {
                    store.userInfo && (store.userInfo.role !== 'admin' || store.userInfo.role === 'superadmin') && (
                        <Link className='px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600' to='/dashboard/advertisements/create'>
                            Create Advertisement
                        </Link>
                    )
                }

            </div>
            <AdContent />
        </div>
    );
}

export default Advertisement;
