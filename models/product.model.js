import { model, Schema } from "mongoose"

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number

}, {timestamps: true})

const ProductModel = model("Product", productSchema)
export default ProductModel