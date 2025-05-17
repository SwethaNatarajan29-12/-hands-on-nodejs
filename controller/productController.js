const products = require('../db/models/product');
const user = require('../db/models/users');
const ErrorMessages = require('../utils/error');
const catchAsync = require('../utils/catchAsync');
const users = require('../db/models/users');

/********************************************************************************************************************
 * *****************************************************************************************************
 * create product info -> must use express.json() in app.js for reading the body(requestPayload)
 * *****************************************************************************************************
 ********************************************************************************************************************/
const createproduct = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    const newproduct = await products.create({
        title: body.title,
        productImage: body.productImage,
        price: body.price,
        shortDescription: body.shortDescription,
        description: body.description,
        productUrl: body.productUrl,
        category: body.category,
        tags: body.tags,
        createdBy: userId,
    });

    return res.status(201).json({
        status: 'success',
        data: newproduct,
    });
});

/*********************************************************************************************************************
 * ******************************************************************************
 * return the products only, which are all createdBy the requested userId
 * ******************************************************************************
 *********************************************************************************************************************/
const getAllproduct = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await products.findAll({
        include: users,
        where: { createdBy: userId },
    });

    return res.json({
        status: 'success',
        data: result,
    });
});

/*************************************************************************************************************************
 * **********************************************************************
 * return the product info by Id(QueryParameter)
 * **********************************************************************
 *************************************************************************************************************************/
const getproductById = catchAsync(async (req, res, next) => {
    const productId = req.params.id;
    const result = await products.findByPk(productId, { include: users });
    if (!result) {
        return next(new ErrorMessages('Invalid product id', 400));
    }
    return res.json({
        status: 'success',
        data: result,
    });
});

/****************************************************************************************************************************
 * ******************************************************************************
 * update productInfo,if the requestedUserId is match with the createdBy
 * ******************************************************************************
 ****************************************************************************************************************************/
const updateproduct = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const body = req.body;

    const result = await products.findOne({
        where: { id: productId, createdBy: userId },
    });

    if (!result) {
        return next(new ErrorMessages('Invalid product id', 400));
    }

    result.title = body.title;
    result.productImage = body.productImage;
    result.price = body.price;
    result.shortDescription = body.shortDescription;
    result.description = body.description;
    result.productUrl = body.productUrl;
    result.category = body.category;
    result.tags = body.tags;

    const updatedResult = await result.save();

    return res.json({
        status: 'success',
        data: updatedResult,
    });
});

/*************************************************************************************************************************
 * ****************************************************************************
 * update productInfo,if the requestedUserId is match with the createdBy
 * ****************************************************************************
 *************************************************************************************************************************/
const deleteproduct = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const body = req.body;

    const result = await products.findOne({
        where: { id: productId, createdBy: userId },
    });

    if (!result) {
        return next(new ErrorMessages('Invalid product id', 400));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Record deleted successfully',
    });
});

module.exports = {
    createproduct,
    getAllproduct,
    getproductById,
    updateproduct,
    deleteproduct,
};