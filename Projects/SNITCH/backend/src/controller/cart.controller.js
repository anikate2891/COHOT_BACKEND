import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import mongoose from "mongoose";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../model/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";



export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  try {
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const stock = await stockOfVariant(productId, variantId);

    const cart =
      (await cartModel.findOne({ user: req.user._id })) ||
      (await cartModel.create({ user: req.user._id }));

    const isProductInCart = cart.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (isProductInCart) {
      const quantityInCart = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.variant.toString() === variantId,
      ).quantity;

      if (quantityInCart + quantity > stock) {
        return res
          .status(400)
          .json({ message: `Not enough stock available`, success: false });
      }

      await cartModel.findOneAndUpdate(
        {
          user: req.user._id,
          "items.product": productId,
          "items.variant": variantId,
        },
        { $inc: { "items.$.quantity": quantity } },
        { new: true },
      );
      return res
        .status(200)
        .json({ message: "Cart updated successfully", success: true }); // ✅ return
    }

    if (quantity > stock) {
      return res
        .status(400)
        .json({ message: `Only ${stock} units available`, success: false });
    }
    cart.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price: product.price,
    });
    await cart.save();
    return res
      .status(200)
      .json({ message: "Item added to cart successfully", success: true });
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.user;  
//// Aggregation PipeLine Code
    let cart = await getCartDetails(user._id);
// Aggregation PipeLine Code

console.log("cart result:", cart);
    if (!cart.length) {
    await cartModel.create({ user: user._id });
    return res.status(200).json({
        message: "Cart retrieved successfully",
        success: true,
        data: [{ _id: null, items: [], totalPrice: 0, currency: "INR" }],
    });
}

// ← YE ADD KARO
return res.status(200).json({
    message: "Cart retrieved successfully",
    success: true,
    data: cart[0],
});
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await cartModel.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: itemId } } },
      { new: true },
    );
    if (!cart)
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    return res
      .status(200)
      .json({ message: "Item removed", success: true, data: cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findOneAndUpdate(
      { user: req.user._id, "items._id": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true },
    );

    if (!cart)
      return res
        .status(404)
        .json({ message: "Cart item not found", success: false });

    return res
      .status(200)
      .json({ message: "Quantity updated", success: true, data: cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const createOrderController = async (req, res) => {

  const cart = await getCartDetails(req.user._id);

  if (!cart.length || cart[0].items.length === 0) {
    return res.status(400) .json({ message: "Cart is empty", success: false });
  }

  try {
    const order = await createOrder( cart[0].totalPrice, cart[0].currency);
    const payment = new paymentModel({
      user: req.user._id,
      price: {
        amount: cart[0].totalPrice,
        currency: cart[0].currency,
      },
      razorPayDetails: { orderId: order.id },
      orderItems: cart[0].items.map((item) => ({
        title: item.product.title,
        productId: item.product._id,
        variantId: item.variant._id,
        quantity: item.quantity,
        images: item.product.variants.images || item.product.images,
        description: item.product.description,

        price: {
          amount: item.product.variants.price.amount || item.product.price.amount,
          currency: item.product.variants.price.currency || item.product.price.currency,
        }
      })),
    });

    await payment.save();



    return res.status(200).json({ message: "Order created", success: true, order });


  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}

export const verifyOrderController = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const paymentRecord = await paymentModel.findOne({
        "razorPayDetails.orderId": razorpay_order_id,
        status: "pending" 
      });
      if (!paymentRecord) {
        return res.status(404).json({ message: "Payment record not found", success: false });
      }

      const isPaymentValid = validatePaymentVerification(
        { 
          order_id: razorpay_order_id, 
          payment_id: razorpay_payment_id 
        }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET
      );

      if (!isPaymentValid) {
        paymentRecord.status = "failed";
        await paymentRecord.save();
        return res.status(400).json({ message: "Payment verification failed", success: false });
      }

      paymentRecord.status = "completed";
      await paymentRecord.save();

      return res.status(200).json({ message: "Payment verified successfully", success: true });
    }

  catch (error) {    
    res.status(500).json({ message: "Server error", success: false });
  }
}
