const { authentication, restrictTo } = require('../controller/authController');
const {
    createproduct,
    getAllproduct,
    getproductById,
    updateproduct,
    deleteproduct,
} = require('../controller/productController');

const router = require('express').Router();

router.route('/').post(authentication, restrictTo('1'), createproduct).get(authentication, restrictTo('1'), getAllproduct);

router.route('/:id').get(authentication, restrictTo('1'), getproductById).patch(authentication, restrictTo('1'), updateproduct).delete(authentication, restrictTo('1'), deleteproduct);

module.exports = router;