import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
     email: '',
    
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      console.log("Sending data to API:", values);
      const payload = {
      email: values.email,
      password: values.password,

      }
      try{
        const res = await axios.post('http://localhost:8000/api/login', payload)
        const userId = res.data.id; 
        localStorage.setItem('user_id', userId);
        console.log(userId, "=========================")
        navigate('/landingpage', { state: { id: userId } }); 
        toast.success(res.data.msg || "Login Successfull !!");
        
      }  catch (error:any) {
          const errMsg = error?.res?.data?.msg || "Login failed. Please try again.";
         toast.error(errMsg);
        }finally {
          console.log('Form submission attempt completed.');
          
        }
    },
  });

  return (
    <div className="main-page">

    <form onSubmit={formik.handleSubmit}>
      <div className="login">
      

       

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

       

        <button type="submit" className="btn">
          Login
        </button>
      </div>
    </form>
            </div>
  );
};

export default LoginForm;
