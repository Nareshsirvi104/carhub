import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { Link, useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'
import { HiOutlineTrash } from 'react-icons/hi'
import toast from 'react-hot-toast';

const Cart = () => {

    const [cart, setcart] = useCart();
    const [auth] = useAuth();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    // ✅ SAFE TOTAL PRICE
    const totalPrice = () => {
        try {
            let total = 0;
            (cart || []).forEach((item) => {
                total += parseInt(item?.price) || 0;
            });
            return total;
        } catch (error) {
            console.log(error);
            return 0;
        }
    };

    // ✅ REMOVE ITEM SAFE
    const removeCartItem = (pid) => {
        try {
            let updatedCart = (cart || []).filter(item => item?._id !== pid);
            setcart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } catch (err) {
            console.log(err)
        }
    }

    // ✅ TOKEN
    const getToken = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/car/braintree/token");
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
        window.scrollTo(0, 0)
    }, [auth?.token]);

    // ✅ PAYMENT
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            await axios.post("http://localhost:5000/api/car/braintree/payment", {
                nonce,
                cart
            });

            setLoading(false);
            localStorage.removeItem("cart");
            setcart([]);
            navigate("/dashboard/user/order");
            toast.success("Payment Completed Successfully ");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const notify = () => toast.success('Item Removed Successfully')

    return (
        <div className='my-5'>
            <section className="h-100 h-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="row">

                                        {/* LEFT SIDE */}
                                        <div className="col-lg-7">
                                            <h5 className="mb-3">
                                                {!auth?.user
                                                    ? "Hello Guest"
                                                    : `Hello ${auth?.user?.name}`}
                                            </h5>
                                            <hr />

                                            <p>
                                                {cart?.length
                                                    ? `You Have ${cart.length} items`
                                                    : "Your Cart Is Empty"}
                                            </p>

                                            {(cart || [])
                                                .filter(item => item && typeof item === "object")
                                                .map((p, index) => {

                                                    const brand = p?.brand || {};
                                                    const image =
                                                        Array.isArray(p?.productPictures) && p.productPictures.length > 0
                                                            ? `http://localhost:5000/${p.productPictures[0]}`
                                                            : "";

                                                    return (
                                                        <div className="card my-3" key={index}>
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between">

                                                                    <div className="d-flex align-items-center">
                                                                        <Link to={`/car/${p?.slug || ""}`}>
                                                                            <img
                                                                                src={image}
                                                                                alt="car"
                                                                                style={{ maxHeight: '80px' }}
                                                                            />
                                                                        </Link>

                                                                        <div className="mx-2">
                                                                            <p>
                                                                                <span className="badge bg-primary">
                                                                                    {brand?.name || "No Brand"}
                                                                                </span>
                                                                            </p>
                                                                            <p>{p?.name || "No Name"}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <p>₹ {p?.price || 0} Lakhs</p>

                                                                        <button
                                                                            className="btn btn-danger"
                                                                            onClick={() => {
                                                                                removeCartItem(p?._id);
                                                                                notify();
                                                                            }}
                                                                        >
                                                                            <HiOutlineTrash />
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>

                                        {/* RIGHT SIDE */}
                                        <div className="col-lg-5">
                                            <div className="card p-3">

                                                <h3>Cart Summary</h3>
                                                <hr />

                                                <h4>Total: ₹ {totalPrice()} Lakhs</h4>

                                                {!auth?.user?.address ? (
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() => navigate("/login")}
                                                    >
                                                        Login to Checkout
                                                    </button>
                                                ) : (
                                                    <>
                                                        <DropIn
                                                            options={{
                                                                authorization: clientToken,
                                                            }}
                                                            onInstance={(instance) => setInstance(instance)}
                                                        />

                                                        <button
                                                            className="btn btn-dark mt-3"
                                                            onClick={handlePayment}
                                                            disabled={loading || !instance}
                                                        >
                                                            {loading ? "Processing..." : "Make Payment"}
                                                        </button>
                                                    </>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Cart