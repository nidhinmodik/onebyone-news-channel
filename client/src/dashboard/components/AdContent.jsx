import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';
import { base_url } from '../../config/config';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';

const AdContent = () => {
  const { store } = useContext(storeContext);
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [responseState, setResponseState] = useState({ id: '', loading: false });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${base_url}/api/ads`, {
          headers: { Authorization: `Bearer ${store.token}` },
        });
        setAds(data.ads);
        setFilteredAds(data.ads);
        console.log(data.ads);
        
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch advertisements');
      }
    };
    fetchAds();
  }, [store.token]);

  useEffect(() => {
    let filtered = ads;

    if (statusFilter) {
      filtered = ads.filter(ad => ad.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAds(filtered);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, ads]);

  const updateAdStatus = async (status, adId) => {
    try {
      setResponseState({ id: adId, loading: true });
      const { data } = await axios.put(
        `${base_url}/api/ads/update/${adId}`,
        { status },
        { headers: { Authorization: `Bearer ${store.token}` } }
      );
      setResponseState({ id: '', loading: false });
      toast.success(data.message);
      const updatedAds = ads.map(ad => 
        ad._id === adId ? { ...ad, status } : ad
      );
      setAds(updatedAds);
    } catch (error) {
      console.error(error);
      setResponseState({ id: '', loading: false });
      toast.error('Failed to update status');
    }
  };

  const deleteAd = async adId => {
    try {
      setResponseState({ id: adId, loading: true });
      const { data } = await axios.delete(
        `${base_url}/api/ads/delete/${adId}`,
        { headers: { Authorization: `Bearer ${store.token}` } }
      );
      setResponseState({ id: '', loading: false });
      toast.success(data.message);
      setAds(ads.filter(ad => ad._id !== adId));
    } catch (error) {
      console.error(error);
      setResponseState({ id: '', loading: false });
      toast.error('Failed to delete advertisement');
    }
  };

  const paginateAds = () => {
    const start = (currentPage - 1) * perPage;
    return filteredAds.slice(start, start + perPage);
  };

  const handlePerPageChange = e => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const renderStatusButton = (ad, status, bgColor, textColor) => (
    <span
      onClick={() => updateAdStatus(status, ad._id)}
      className={`px-2 py-[2px] ${bgColor} ${textColor} rounded-lg text-xs cursor-pointer`}
    >
      {responseState.loading && responseState.id === ad._id ? 'Loading...' : ad.status}
    </span>
  );

  return (
    <div>
      <div className='px-4 py-3 flex gap-x-3'>
        <select
          onChange={e => setStatusFilter(e.target.value)}
          className='px-3 py-2 rounded-md border border-gray-300 focus:border-green-500 h-10'
        >
          <option value=''>--- Select Status ---</option>
          <option value='pending'>Pending</option>
          <option value='active'>Active</option>
          <option value='deactive'>Deactive</option>
        </select>
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          type='text'
          placeholder='Search Advertisements'
          className='px-3 py-2 rounded-md border border-gray-300 focus:border-green-500 h-10'
        />
      </div>

      <div className='relative overflow-x-auto p-4'>
        <table className='w-full text-sm text-left text-slate-600'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-7 py-3'>No</th>
              <th className='px-7 py-3'>Advertisement</th>
              <th className='px-7 py-3'>Date</th>
              <th className='px-7 py-3'>Status</th>
              <th className='px-7 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginateAds().map((ad, index) => (
              <tr key={ad._id} className='bg-white border-b'>
                <td className='px-6 py-4'>{(currentPage - 1) * perPage + index + 1}</td>
                <td className='px-6 py-4'>
                  <img className='w-[40px] h-[40px]' src={ad.mediaUrl} alt='Ad' />
                </td>
                <td className='px-6 py-4'>{new Date(ad.createdAt).toLocaleDateString()}</td>
                <td className='px-6 py-4'>
                  {store?.userInfo?.role === 'admin' && (
                    <>
                      {ad.status === 'pending' && renderStatusButton(ad, 'active', 'bg-blue-100', 'text-blue-800')}
                      {ad.status === 'active' && renderStatusButton(ad, 'deactive', 'bg-green-100', 'text-green-800')}
                      {ad.status === 'deactive' && renderStatusButton(ad, 'active', 'bg-red-100', 'text-red-800')}
                    </>
                  )}
                  {store?.userInfo?.role !== 'admin' && (
                    <span
                      className={`px-2 py-[2px] ${
                        ad.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                        ad.status === 'active' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      } rounded-lg text-xs`}
                    >
                      {ad.status}
                    </span>
                  )}
                </td>
                <td className='px-6 py-4'>
                  <div className='flex justify-start items-center gap-x-4 text-white'>
                    <Link
                      to={`/dashboard/advertisements/${ad._id}`}
                      className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'
                    >
                      <FaEye />
                    </Link>
                    
                      <>
                        <Link
                          to={`/dashboard/advertisements/edit/${ad._id}`}
                          className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                        >
                          <FaEdit />
                        </Link>
                        <div
                          onClick={() => deleteAd(ad._id)}
                          className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer'
                        >
                          {responseState.loading && responseState.id === ad._id ? 'Loading...' : <FaTrash />}
                        </div>
                      </>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-end px-10 gap-x-3 text-slate-600'>
        <div className='flex gap-x-3 justify-center items-center'>
          <p className='px-4 py-3 font-semibold text-sm'>Ads per Page</p>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className='px-3 py-2 rounded-md border border-gray-300 focus:border-green-500 h-10'
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
          </select>
        </div>
        <p className='px-6 py-3 font-semibold text-sm'>
          {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, filteredAds.length)} of {filteredAds.length}
        </p>
        <div className='flex gap-x-1'>
          <IoIosArrowBack
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={`text-2xl ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 cursor-pointer'}`}
          />
          <IoIosArrowForward
            onClick={() => currentPage < Math.ceil(filteredAds.length / perPage) && setCurrentPage(currentPage + 1)}
            className={`text-2xl ${currentPage === Math.ceil(filteredAds.length / perPage) ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 cursor-pointer'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AdContent;