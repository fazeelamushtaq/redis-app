import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/my-redis")

import { createClient } from "redis";
const redisClient = createClient()
redisClient.connect()

redisClient.on('connect', () => console.log("Redis Connected successfully"))
redisClient.on('error', () => console.log("Failed to connect with Redis"))

import express from "express"
import ProductModel from "./models/product.model.js"
const app = express()
app.listen(8080)

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/product", async (req, res) => {
    try {
        const productsCache = await redisClient.get("products")
        if(productsCache) {
                return res.json(JSON.parse(productsCache))
        }

        const products = await ProductModel.find()
        await redisClient.setEx("products", 10, JSON.stringify(products))
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
        await redisClient.del("products")

        if(!product)
            return res.status(500).json({message: "Product not found with id value"})
        res.json(product)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.delete("/product/:id", async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id)
        await redisClient.del("products")

        if(!product)
            return res.status(500).json({message: "Product not found with id value"})
        res.json(product)
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})