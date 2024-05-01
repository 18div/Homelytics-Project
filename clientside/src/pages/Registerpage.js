import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Registerpage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);

    const handleRegister = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phoneno', phoneno);
        formData.append('password', password);
        formData.append('image', image);

        try {
            const response = await axios.post("https://homelytics-project.onrender.com/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
            alert("Registration successful", "You have been registered Successfully");
            setName("");
            setEmail("");
            setPhoneno("");
            setPassword("");
        } catch (error) {
            alert("Registration Error", "An error occurred while registering");
            console.log("registration failed", error);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="mt-4  flex items-center justify-around min-h-screen">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className=" max-w-md mx-auto" onSubmit={handleRegister}>
                    <input type="name" placeholder="John Doe" value={name}
                        onChange={ev => setName(ev.target.value)} />
                    <input type="email" placeholder="youremail@gmail.com" value={email}
                        onChange={ev => setEmail(ev.target.value)} />
                    <input type="number" placeholder="1234567890" value={phoneno}
                        onChange={ev => setPhoneno(ev.target.value)} />
                    <input type="password" placeholder="your password" value={password}
                        onChange={ev => setPassword(ev.target.value)} />
                    <div className="mt-3">
                    <input type="file" onChange={handleImageChange} />
                    </div>
                    <button className="primary shadow shadow-md shadow-purple-800 mt-3">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-lg" to={"/login"}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registerpage;
