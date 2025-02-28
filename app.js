// const add = require('./Add.js');

// let arr = [1, 2, 3, 4, 5];
// add(arr);

// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.end('pradeep weds angu');
// });

// const PORT = 5000;

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// }); 

// const students = [
//     {id:29,name:"majid",age:25},
//     {id:42,name:"sam",age:20},
//     {id:33,name:"pradeep",age:15},
// ]

const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const PORT = 8000;

// app.get('/:id', (req, res) => {
//     const { id } = req.params;

//     if (id) {
//         const result = students.find((item) => item.id == id);
//         // res.json(`Hello World ${id} and ${name} age is ${age}`);
//         res.json(`Hello World ${result.name} and age is ${result.age}`);
//     }

//     res.json('Hellooooo World');
// });

const mongourl = "mongodb+srv://majidsmart7:maji5002@cluster0.jyfpj.mongodb.net/test";      

const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
});
const expenseModel = mongoose.model('expense-tracker', expenseSchema);    

mongoose.connect(mongourl).then(() => {
    console.log('MongoDB Atlas connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }); 
}).catch((err) => { 
    console.log(err);
});

app.post("/api/expenses", async (req, res) => {
    const { title, amount } = req.body;
    const newexpense = new expenseModel({
        id: uuidv4(),
        title : title, 
        amount : amount
    });
    const savedexpenses = await newexpense.save();
    res.status(200).json(savedexpenses);
});

//Get all
// app.get("/api/expenses/", async (req, res) => {
//     const expenses = await expenseModel.find().limit(2);
//     res.status(200).json(expenses);
// });

//Get by Index
app.get("/api/expenses/byIndex/:index", async (req, res) => {
    const { index } = req.params;
    console.log(index)
    const expenses = await expenseModel.find().skip(index-1).limit(1);
    console.log(expenses)
    res.status(200).json(expenses);
});

//Get by ID
// app.get("/api/expenses/byId/:id", async (req, res) => {
//     const { id } = req.params;
//     const expenses = await expenseModel.find({ id });
//     res.status(200).json(expenses);
// });

app.put("/api/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const { title, amount } = req.body;

        if (!title || !amount) {
            return res.status(400).json({ message: "Title and amount are required" });
        }

        const updatedExpense = await expenseModel.findOneAndUpdate({ id }, { title, amount });

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(updatedExpense); 
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

//Delete all

app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await expenseModel.findOneAndDelete({ id });
        console.log(deletedExpense)
        res.status(200).json(deletedExpense);
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});