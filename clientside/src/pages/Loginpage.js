import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post("https://homelytics-app.onrender.com/login", { email, password });
      console.log(response.data);
      if (response.data.success) {
        localStorage.setItem('token',response.data.token);
        alert('Login Success');
        window.location.href = '/';
      } else {
        alert('Login failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };


  return (
    <div className="mt-4  flex items-center justify-around min-h-screen">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="youremail@gmail.com" 
            value={email} 
            onChange={ev => {
              console.log(ev.target.value);
              setEmail(ev.target.value);
            }}
          />
          <input 
            type="password" 
            placeholder="your password" 
            value={password} 
            onChange={ev => {
              console.log(ev.target.value);
              setPassword(ev.target.value);
            }}
          />
          <button className="primary shadow shadow-md shadow-purple-800 mt-3">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? <Link className="underline text-lg" to={"/register"}>Register Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
