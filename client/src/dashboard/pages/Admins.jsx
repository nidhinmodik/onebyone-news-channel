import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { base_url } from '../../config/config';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';

const Admins = () => {
  const { store } = useContext(storeContext);
  const [admins, setAdmins] = useState([]);
  const [responseState, setResponseState] = useState({ id: '', loading: false });

  const getAdmins = async () => {
    try {
      const { data } = await axios.get(`${base_url}/api/admins`, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setAdmins(data.admins);
    } catch (error) {
      console.error(error);
    }
  };

  const delete_admin = async (adminId) => {
    try {
      setResponseState({ id: adminId, loading: true });
      const { data } = await axios.delete(`${base_url}/api/admin/delete/${adminId}`, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setResponseState({ id: '', loading: false });
      toast.success(data.message);
      setAdmins(admins.filter((admin) => admin._id !== adminId));
    } catch (error) {
      console.error(error);
      setResponseState({ id: '', loading: false });
      toast.error('Failed to delete admin');
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-medium">Admins</h2>
        <Link className="px-3 py-[6px] bg-blue-500 rounded-sm text-white hover:bg-blue-600" to="/dashboard/admin/add">Add Admin</Link>
      </div>
      <div className="relative overflow-x-auto p-4">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-7 py-3">No</th>
              <th className="px-7 py-3">Name</th>
              <th className="px-7 py-3">Role</th>
              <th className="px-7 py-3">Email</th>
              <th className="px-7 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, i) => (
              <tr key={i} className="bg-white border-b">
                <td className="px-6 py-4">{i + 1}</td>
                <td className="px-6 py-4">{admin.name}</td>
                <td className="px-6 py-4">{admin.role}</td>
                <td className="px-6 py-4">{admin.email}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-start items-center gap-x-4 text-white">
                    <Link to={`/dashboard/admin/${admin._id}`} className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"><FaEye /></Link>
                    <button onClick={() => delete_admin(admin._id)} disabled={responseState.loading && responseState.id === admin._id} className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;