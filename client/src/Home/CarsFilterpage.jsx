import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai'
import { MdAirlineSeatReclineExtra } from 'react-icons/md'
import { BsFuelPumpFill } from 'react-icons/bs'
import { TbStars } from 'react-icons/tb'
import { PiCurrencyInrFill } from 'react-icons/pi'
import toast from 'react-hot-toast';
import { Checkbox, Radio } from "antd";
import axios from 'axios';
import { Price } from '../pages/Price';
import { ColorRing } from 'react-loader-spinner'

const CarsHome = () => {

    const [cars, setcars] = useState([]);
    const [cart, setcart] = useCart()
    const [brand, setBrand] = useState([])
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [search, setsearch] = useState('');
    const [loading, setLoading] = useState(true);

    const getAllBrand = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/brand/getAll-brand`)
            setBrand(Array.isArray(data?.brands) ? data.brands : [])
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const getAllcars = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/car/getAll-car`);
            const data = await res.json();
            setcars(Array.isArray(data?.cars) ? data.cars : []);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setcars([]);
            setLoading(false);
        }
    };

    const handleBrandChange = (e, brandId) => {
        if (e.target.checked) {
            setSelectedBrands(prev => [...prev, brandId]);
        } else {
            setSelectedBrands(prev => prev.filter(id => id !== brandId));
        }
    };

    const handlePriceChange = (e) => {
        setSelectedPriceRange(e.target.value);
    };

    const resetFilters = () => {
        setSelectedBrands([]);
        setSelectedPriceRange(null);
        setsearch('');
    };

    const notify = () => toast.success('Added to Cart Successfully')

    useEffect(() => {
        getAllBrand();
        getAllcars();
        window.scrollTo(0, 0)
    }, []);

    return (
        <>
            <div className="brand_wrapper" id='cars'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">A Wide Range of Cars Awaits!</p>
                    <h2 className="brand_title">Cars showcase</h2>
                </div>
            </div>

            <div className="container">
                <div className="row" style={{ marginBottom: '100px', marginTop: '-50px' }}>

                    {/* LEFT FILTER */}
                    <div className='col-md-12 col-lg-3'>
                        <h4>🔎 Search Your Car</h4>
                        <input
                            type="search"
                            placeholder="Search your car..."
                            onChange={(e) => setsearch(e.target.value)}
                            className="form-control"
                        />

                        <h4 className="mt-4">Filter By Brands</h4>
                        {brand.map((c) => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => handleBrandChange(e, c._id)}
                                checked={selectedBrands.includes(c._id)}
                            >
                                {c?.name}
                            </Checkbox>
                        ))}

                        <h4 className="mt-4">Filter By Price</h4>
                        <Radio.Group onChange={handlePriceChange} value={selectedPriceRange}>
                            {Price.map((p) => (
                                <Radio key={p._id} value={p.array}>{p.name}</Radio>
                            ))}
                        </Radio.Group>

                        <button className="btn btn-outline-dark my-4" onClick={resetFilters}>
                            RESET FILTERS
                        </button>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-md-12 col-lg-9">
                        {loading ? (
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <ColorRing visible={true} />
                            </div>
                        ) : (
                            <div className="row">

                                {(cars || [])
                                    .filter(car => car && typeof car === "object")

                                    // SEARCH
                                    .filter(car => {
                                        if (!search) return true;
                                        return car?.name?.toLowerCase().includes(search.toLowerCase());
                                    })

                                    // BRAND
                                    .filter(car => {
                                        if (selectedBrands.length === 0) return true;
                                        return selectedBrands.includes(car?.brand?._id);
                                    })

                                    // PRICE
                                    .filter(car => {
                                        if (!selectedPriceRange) return true;
                                        const [min, max] = selectedPriceRange;
                                        return car?.price >= min && car?.price <= max;
                                    })

                                    .map((p, index) => {

                                        const brand = p?.brand || {};
                                        const image =
                                            Array.isArray(p?.productPictures) && p.productPictures.length > 0
                                                ? p.productPictures[0]
                                                : "";

                                        return (
                                            <div className="col-md-12 col-lg-4 mb-3" key={index}>
                                                <div className="card">

                                                    <div className="d-flex justify-content-between p-3">
                                                        <p>{brand.name || "No Brand"}</p>

                                                        <Link to={`/brand/${brand.slug || ""}`}>
                                                            <img
                                                                src={brand.brandPictures || ""}
                                                                alt="brand"
                                                                style={{ width: "35px", height: "35px" }}
                                                            />
                                                        </Link>
                                                    </div>

                                                    <Link to={`/car/${p?.slug || ""}`}>
                                                        <img src={image} alt="car" />
                                                    </Link>

                                                    <div className="card-body">
                                                        <h4>{p?.name}</h4>

                                                        <p><PiCurrencyInrFill /> {p?.price}</p>
                                                        <p><BsFuelPumpFill /> {p?.fuelType}</p>
                                                        <p><TbStars /> {p?.safetyrating}</p>
                                                        <p><MdAirlineSeatReclineExtra /> {p?.seater}</p>

                                                        <Link to={`/car/${p?.slug || ""}`} className="btn btn-primary">
                                                            <AiOutlineEye /> View
                                                        </Link>

                                                        <button
                                                            className="btn btn-outline-primary mx-2"
                                                            onClick={() => {
                                                                setcart([...cart, p]);
                                                                localStorage.setItem('cart', JSON.stringify([...cart, p]));
                                                                notify();
                                                            }}
                                                        >
                                                            <AiOutlineShoppingCart /> Add
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CarsHome