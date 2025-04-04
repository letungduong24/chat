import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../../store/useAuthStore.js';

const SignIn = () => {
  const {login, isLogging} = useAuthStore()
  const navigate = useNavigate()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

 

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    if (Object.values(formData).some(value => !value.trim())) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    try {
      await login(formData)
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleFormChange = (e) => {
    setFormData((prev) => (
      {...prev, [e.target.name]: e.target.value}
    ))
  }

  return (
    <div className='w-full flex-grow flex justify-center items-center px-5'>
      <form onSubmit={handleSubmit} className='relative xl:w-1/3 md:w-2/3 bg-base-200 p-10 rounded-3xl shadow-2xl' action="">
        <h2 className='mb-4 text-2xl font-bold justify-center flex text-gray-300'>Đăng nhập</h2>
        <label className="input w-full mb-4">
          <span className="label">Email</span>
          <input name='email' value={formData.email} onChange={(e) => handleFormChange(e)} className='' type="text" placeholder="example@mail.com" />
        </label>
        <label className="input w-full mb-4">
          <span className="label">Mật khẩu</span>
          <input name='password' value={formData.password} onChange={(e) => handleFormChange(e)} type={isShowPassword ? "text" : "password"} placeholder="Bí mật" />
          <button type='button' onClick={() => setIsShowPassword(!isShowPassword)}>{isShowPassword ? <FaEyeSlash /> : <FaRegEye />}</button>
        </label>
        <button type='submit' className="btn btn-outline w-full text-gray-300">Đăng nhập</button>
        <p className='text-sm text-center mt-4'>Chưa có tài khoản? <Link className='text-blue-400 underline' to={'/signup'}>Đăng ký ngay</Link></p>
      </form>
    </div>
  )
}

export default SignIn