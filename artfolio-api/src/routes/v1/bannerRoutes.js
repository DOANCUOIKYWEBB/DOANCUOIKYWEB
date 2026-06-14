import express from 'express'
import { bannerController } from '~/controllers/bannerController.js'
import { protect, restrictTo } from '~/middlewares/authMiddleware.js'

const Router = express.Router()

// PUBLIC — không cần đăng nhập
Router.get('/active', bannerController.getActiveBanners)

// ADMIN — cần đăng nhập + role admin
Router.use(protect)
Router.use(restrictTo('admin'))

Router.route('/')
  .get(bannerController.getAllBanners)
  .post(bannerController.createBanner)

Router.route('/:id')
  .patch(bannerController.updateBanner)
  .delete(bannerController.deleteBanner)

export default Router