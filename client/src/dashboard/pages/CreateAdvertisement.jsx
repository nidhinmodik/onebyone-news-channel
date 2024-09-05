import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdCloudUpload } from "react-icons/md";
import { base_url } from '../../config/config';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';

const CreateAdvertisement = () => {
  const { store } = useContext(storeContext);
  const [media, setMedia] = useState('');
  const [mediaPreview, setMediaPreview] = useState('');
  const [loader, setLoader] = useState(false);
  const [ads, setAds] = useState([]);
  const [show, setShow] = useState(false);

  const mediaHandle = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setMediaPreview(file.type.startsWith('video/') ? URL.createObjectURL(file) : '');
      setMedia(file);
    }
  };

  const addAdvertisement = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('media', media);
    try {
      setLoader(true);
      const { data } = await axios.post(`${base_url}/api/ads/add`, formData, {
        headers: {
          "Authorization": `Bearer ${store.token}`
        }
      });
      setLoader(false);
      toast.success(data.message);
      setMedia('');
      setMediaPreview('');
    } catch (error) {
      setLoader(false);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const getAds = async () => {
    try {
      const { data } = await axios.get(`${base_url}/api/ads`, {
        headers: {
          "Authorization": `Bearer ${store.token}`
        }
      });
      setAds(data.ads);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAds();
  }, []);

  const mediaHandler = async (e) => {
    const files = e.target.files;
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('mediaFiles', files[i]);
      }
      const { data } = await axios.post(`${base_url}/api/ads/upload`, formData, {
        headers: {
          "Authorization": `Bearer ${store.token}`
        }
      });
      setAds([...ads, ...data.ads]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='bg-white rounded-md'>
      <div className='flex justify-between p-4'>
        <h2 className='text-xl font-medium'>Add Advertisement</h2>
        <Link className='px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600' to='/dashboard/ads'>Advertisements</Link>
      </div>

      <div className='p-4'>
        <form onSubmit={addAdvertisement}>
          <div className='mb-6'>
            <div>
              <label htmlFor="media" className={`w-full h-[100px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed`}>
                {
                  mediaPreview ? 
                  <video className='w-full h-full' controls src={mediaPreview}></video> : 
                  <div className='flex justify-center items-center flex-col gap-y-2'>
                    <span className='text-2xl'><MdCloudUpload /></span>
                    <span>Select Media</span>
                  </div>
                }
              </label>
              <input required onChange={mediaHandle} className='hidden' type="file" id='media' accept="video/*,image/*" />
            </div>
          </div>
          <div className='mt-4'>
            <button disabled={loader} className='px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600'>
              {loader ? 'Loading...' : 'Add Advertisement'}
            </button>
          </div>
        </form>
      </div>
      <input onChange={mediaHandler} type="file" multiple id='mediaFiles' className='hidden' accept="video/*,image/*" />
      {
        show && <Gallery setShow={setShow} media={ads} />
      }
    </div>
  );
};

export default CreateAdvertisement;