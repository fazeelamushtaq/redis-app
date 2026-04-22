import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/my-redis")

import express from "express"
import ProductModel from "./models/product.model.js"
const app = express()
app.listen(8080)

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/product", async (req, res) => {
    try {
        const products = await ProductModel.find()
        res.json(products)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.post("/product", async (req, res) => {
    try {
        const product = await ProductModel.create(req.body)
        res.json(product)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.put("/product/:id", async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(product)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.delete("/product/:id", async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id)
        res.json(product)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})