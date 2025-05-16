require('dotenv').config({path : `${process.cwd()}/.env`});
const express = require('express');
const app = express();
const authRouter = require('./router/authRouter');

app.get('/', (req, res)=>{
    res.status(200).json({
        status : '200',
        message : 'Success'
    })
})
app.use(express.json()); // for accepting json data as payload
app.use('/api/v1/auth', authRouter);


app.use(/(.*)/, (req,res,next)=>{
    res.status(404).json({
        status : '404',
        message: 'API Not found'
    })
});

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, ()=>{
    console.log("The Server is UP and listening - ", PORT);
})