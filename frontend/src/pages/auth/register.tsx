import React from 'react';
import { useFormik } from 'formik'; // ✅ Correct import
import * as Yup from 'yup';
import './register.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RegisterForm = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      phone_no: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone_no: Yup.string().required('Phone number is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    }),
    onSubmit: async (values) => {
      console.log("Sending data to API:", values);
      const payload = {
      fullname: values.fullname,
      email: values.email,
      phone_no: values.phone_no,
      password: values.password,
      confirm_password: values.confirm_password,
      }
      try{
        const res = await axios.post('http://localhost:8000/api/signup', payload)
        console.log("User registered:", res.data);
        navigate('/login');
        toast.success(res.data.msg || "Registration successful!  Please Login Again");

      }  catch (error:any) {
          const errMsg = error?.res?.data?.msg || "Registration failed. Please try again.";
         toast.error(errMsg);
        }finally {
          console.log('Form submission attempt completed.');
          
        }
    },
  });

  return (
    <div className="main-page">

  
    <form onSubmit={formik.handleSubmit}>
      <div className="register">
        <div className="fullname">
          <label>Full Name</label>
          <input
            name="fullname"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.fullname}
            placeholder="Enter Your Full Name"
          />
        </div>

        <div className="phoneno">
          <label>Phone Number</label>
          <input
            name="phone_no"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phone_no}
            placeholder="Enter Your Phone Number"
          />
        </div>

        <div className="email">
          <label>Email</label>
          <input
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="Enter Your Email"
          />
        </div>

        <div className="password">
          <label>Password</label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Enter Password"
          />
        </div>

        <div className="password">
          <label>Confirm Password</label>
          <input
            name="confirm_password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirm_password}
            placeholder="Confirm Password"
          />
        </div>

        <button type="submit" className="btn">
          Create Account
        </button>
      </div>
    </form>
    </div>
  );
};

export default RegisterForm;
