import express from 'express'
import { adminController } from '~/controllers/adminController.js'
import { bannerController } from '~/controllers/bannerController.js'
import { protect, restrictTo } from '~/middlewares/authMiddleware.js'

const Router = express.Router()


Router.use(protect)
Router.use(restrictTo('admin'))

Router.get('/stats', adminController.getSystemStats)

Router.route('/banners')
  .get(bannerController.getAllBanners)
  .post(bannerController.createBanner)

Router.route('/banners/:id')
  .patch(bannerController.updateBanner)
  .delete(bannerController.deleteBanner)

Router.route('/users')
  .get(adminController.getAllUsers)

Router.route('/users/:id/status')
  .patch(adminController.changeUserStatus)

Router.route('/users/:id')
  .delete(adminController.deleteUserByAdmin)

Router.route('/portfolios/:id')
  .delete(adminController.deletePortfolioByAdmin)

export default Router