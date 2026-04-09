import React, { useEffect, useState } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import '../styles/navbar.css'
import App from '../images/App.png'
import { Link } from "react-router-dom"
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const [color, setcolor] = useState(false);

    const changeColor = () => {
        if (window.scrollY >= 90) {
            setcolor(true);
        } else {
            setcolor(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeColor);
        return () => {
            window.removeEventListener('scroll', changeColor);
        };
    }, []);

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        });
        localStorage.removeItem('auth');
        toast.success('Logged Out Successfully');
    };

    useEffect(() => {
        const navBar = document.querySelectorAll(".nav-link");
        const navCollapse = document.querySelector(".navbar-collapse.collapse");

        const handleNavClick = () => {
            if (navCollapse) navCollapse.classList.remove("show");
        };

        navBar.forEach((a) => {
            a.addEventListener("click", handleNavClick);
        });

        return () => {
            navBar.forEach((a) => {
                a.removeEventListener("click", handleNavClick);
            });
        };
    }, []);

    return (
        <header className={color ? 'header_wrapper header-scrolled' : 'header_wrapper'}>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid mx-3">
                    <Link to='/'>
                        <img src={App} alt="logo" style={{ width: '130px' }} />
                    </Link>
                    <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <BiMenuAltRight size={35} />
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav menu-navbar-nav">
                            <li className="nav-item">
                                <Link to='/' className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/about' className="nav-link">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/brands' className="nav-link">Brands</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/cars' className="nav-link">Cars</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/cart' className="nav-link">
                                    <AiOutlineShoppingCart size={25} color='blueviolet' />
                                    <span className='badge' style={{ marginLeft: '3px' }}>
                                        {cart?.length}
                                    </span>
                                </Link>
                            </li>
                        </ul>

                        <ul className='mt-2 text-center list-unstyled d-lg-flex align-items-center'>
                            {!auth.user ? (
                                <>
                                    <li className="nav-item">
                                        <Link to='/login' className="nav-link learn-more-btn btn-extra-header">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/register' className="nav-link learn-more-btn">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="nav-link learn-more-btn">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link onClick={handleSubmit} to='/login' className="nav-link learn-more-btn-logout">
                                            Logout
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;