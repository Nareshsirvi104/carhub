import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart, AiOutlineEye, AiFillCar } from 'react-icons/ai'
import { MdAirlineSeatReclineExtra } from 'react-icons/md'
import { BsFuelPumpFill } from 'react-icons/bs'
import { TbStars } from 'react-icons/tb'
import { PiCurrencyInrFill } from 'react-icons/pi'
import toast from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner'

const CarsHome = () => {

    const [cars, setcars] = useState([]);
    const [cart, setcart] = useCart()
    const [loading, setLoading] = useState(true);

    const getAllcars = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/car/getAll-car`);
            const data = await res.json();

            console.log("API DATA:", data); // 🔥 debug

            setcars(Array.isArray(data?.cars) ? data.cars : []);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setcars([]);
            setLoading(false);
        }
    };

    const notify = () => toast.success('Added to Cart Successfully')

    useEffect(() => {
        getAllcars();
    }, []);

    return (
        <>
            <div className="brand_wrapper" id='cars'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">Explore an array of exciting new Cars !</p>
                    <h2 className="brand_title">Latest Cars showcase</h2>
                </div>
            </div>

            {loading ? (
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <ColorRing visible={true} />
                </div>
            ) : (
                <div className="container">
                    <div className="row" style={{ marginTop: '-40px' }}>

                        {cars
                            .filter((p) => p && typeof p === "object") // 🔥 remove null/invalid
                            .slice(0, 8)
                            .map((p, index) => {

                                const brand = p?.brand || {}; // 🔥 safe object

                                return (
                                    <div className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3" key={index}>
                                        <div className="card">

                                            <div className="d-flex justify-content-between p-3">
                                                <p className="lead mb-0 respBrand">
                                                    {brand.name || "No Brand"}
                                                </p>

                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                                                    style={{ width: '35px', height: '35px' }}>

                                                    <Link to={`/brand/${brand.slug || ""}`}>
                                                        <img
                                                            src={brand.brandPictures || ""}
                                                            alt={brand.name || "brand"}
                                                            style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                                                        />
                                                    </Link>
                                                </div>
                                            </div>

                                            <Link to={`/car/${p?.slug || ""}`} className='text-center'>
                                                <img
                                                    src={p?.productPictures || ""}
                                                    alt={p?.name || "car"}
                                                    style={{ maxWidth: '100%', maxHeight: '130px', objectFit: 'contain' }}
                                                    className='border rounded'
                                                />
                                            </Link>

                                            <div className="card-body ">
                                                <h4 className="text-center mb-4 respName">
                                                    {p?.name || "No Name"}
                                                </h4>

                                                <div className="d-flex justify-content-between">
                                                    <h6 className='respBrand'>
                                                        <PiCurrencyInrFill /> : {p?.price || 0} Lakhs
                                                    </h6>
                                                    <h6 className='respBrand'>
                                                        <BsFuelPumpFill /> : {p?.fuelType || "N/A"}
                                                    </h6>
                                                </div>

                                                <div className="d-flex justify-content-between my-2">
                                                    <h6 className='respBrand'>
                                                        <TbStars /> : {p?.safetyrating || "N/A"}
                                                    </h6>
                                                    <h6 className='respBrand'>
                                                        <MdAirlineSeatReclineExtra /> : {p?.seater || "N/A"} Seater
                                                    </h6>
                                                </div>

                                                <div className='text-center'>
                                                    <Link
                                                        className='btn my-2'
                                                        style={{ backgroundColor: 'blueviolet', color: 'white' }}
                                                        to={`/car/${p?.slug || ""}`}>

                                                        <AiOutlineEye size={20} /> View
                                                    </Link>

                                                    <button
                                                        className='btn btn-outline-primary my-2 mx-3'
                                                        onClick={() => {
                                                            setcart([...cart, p]);
                                                            localStorage.setItem('cart', JSON.stringify([...cart, p]));
                                                            notify()
                                                        }}>

                                                        <AiOutlineShoppingCart size={20} /> Add To Cart
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}

                    </div>

                    <div className="col-12 text-center my-5">
                        <Link
                            to='/cars'
                            className='btn btn-lg text-white'
                            style={{ backgroundColor: 'blueviolet' }}>

                            View More <AiFillCar size={25} />
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default CarsHome