import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactImageTurntable } from 'react-image-turntable';
import { Tb360View } from 'react-icons/tb';
import '../styles/carview.css';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbEngine, TbStars } from 'react-icons/tb';
import { AiOutlineNodeIndex, AiOutlineColumnWidth } from 'react-icons/ai';
import { MdCompareArrows, MdOutlinePropaneTank, MdAirlineSeatReclineExtra } from 'react-icons/md';
import { GiBackwardTime } from 'react-icons/gi';
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { PiCurrencyInrFill } from 'react-icons/pi';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { LuGalleryHorizontal } from 'react-icons/lu';
import { ColorRing } from 'react-loader-spinner';

const CarView = () => {
    const params = useParams();
    const [car, setCar] = useState({});
    const [cart, setcart] = useCart();
    const [relatedCar, setRelatedCar] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= GET SINGLE CAR =================
    const getCar = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:5000/api/car/getCarById-car/${params.slug}"
            );

            setCar(data.car);

            // ✅ Safe related car call
            if (data?.car?.brand?._id) {
                getRelatedCar(data.car._id, data.car.brand._id);
            }

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    // ================= RELATED CAR =================
    const getRelatedCar = async (cid, bid) => {
        try {
            const { data } = await axios.get(
                "http://localhost:5000/api/car/related-car/${cid}/${bid}"
            );
            setRelatedCar(data?.cars || []);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= USE EFFECT =================
    useEffect(() => {
        if (params?.slug) {
            getCar();
        }
        window.scrollTo(0, 0);
    }, [params?.slug]);

    // ================= CART =================
    const notify = () => toast.success('Added To Cart Successfully');

    const updatedAt = car?.updatedAt
        ? new Date(car.updatedAt).toLocaleString()
        : '';

    // ================= IMAGE GALLERY =================
    const galleryImages = (car?.productPictures || []).map(picture => ({
        original: picture,
        thumbnail: picture
    }));

    return (
        <div className='container marginStyle'>
            {loading ? (
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <ColorRing visible={true} />
                </div>
            ) : (
                <div className="row">

                    {/* LEFT SIDE IMAGES */}
                    <div className="col-md-6 text-center">
                        <ReactImageTurntable
                            images={car?.productPictures || []}
                            className='border border-4 rounded'
                        />

                        <Tb360View size={50} />

                        <ImageGallery
                            items={galleryImages}
                            showNav={false}
                            showFullscreenButton={false}
                        />

                        <LuGalleryHorizontal size={40} className='my-3' />
                    </div>

                    {/* RIGHT SIDE DETAILS */}
                    <div className="col-md-6">
                        <div className='centerMob'>
                            <Link to={`/brand/${car?.brand?.name || ''}`}>
                                <img
                                    src={car?.brand?.brandPictures}
                                    className="img-fluid"
                                    style={{ maxHeight: '40px' }}
                                    alt="brand"
                                />
                                <span className='badge m-2 bg-primary'>
                                    {car?.brand?.name || "No Brand"}
                                </span>
                            </Link>

                            <h3>{car?.name}</h3>
                        </div>

                        <h5>Description:</h5>
                        <p>{car?.description}</p>

                        <h4>₹ {car?.price}</h4>
                        <h6>Updated: {updatedAt}</h6>

                        <button
                            className='btn btn-primary'
                            onClick={() => {
                                setcart([...cart, car]);
                                localStorage.setItem('cart', JSON.stringify([...cart, car]));
                                notify();
                            }}
                        >
                            <AiOutlineShoppingCart /> Add To Cart
                        </button>

                        <Link className='btn btn-outline-dark mx-2' to='/cart'>
                            <AiOutlineEye /> View Cart
                        </Link>

                        {/* TABLE */}
                        <table className="table table-bordered my-4">
                            <tbody>
                                <tr>
                                    <td><BsFuelPumpFill /> {car?.fuelType}</td>
                                    <td><TbEngine /> {car?.mileage}</td>
                                    <td><TbStars /> {car?.safetyrating}</td>
                                </tr>
                                <tr>
                                    <td><GiBackwardTime /> {car?.warranty}</td>
                                    <td><MdAirlineSeatReclineExtra /> {car?.seater}</td>
                                    <td><MdCompareArrows /> {car?.size}</td>
                                </tr>
                                <tr>
                                    <td><MdOutlinePropaneTank /> {car?.fuelTank}</td>
                                    <td><AiOutlineColumnWidth /> {car?.engineSize}</td>
                                    <td><AiOutlineNodeIndex /> {car?.transmission}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* RELATED CARS */}
                    <div className="container mt-5">
                        <h2 className="text-center mb-4">
                            Related {car?.brand?.name || ''} Cars
                        </h2>

                        <div className="row">
                            {relatedCar.length > 0 ? (
                                relatedCar.map((p) => (
                                    <div className="col-md-3" key={p._id}>
                                        <div className="card p-2">

                                            <Link to={`/car/${p.slug}`}>
                                                <img
                                                    src={p.productPictures?.[0]}
                                                    alt={p.name}
                                                    className='img-fluid'
                                                />
                                            </Link>

                                            <h5>{p.name}</h5>
                                            <p>₹ {p.price}</p>

                                            <button
                                                className='btn btn-sm btn-primary'
                                                onClick={() => {
                                                    setcart([...cart, p]);
                                                    localStorage.setItem('cart', JSON.stringify([...cart, p]));
                                                    notify();
                                                }}
                                            >
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-center'>No Related Cars</p>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CarView;