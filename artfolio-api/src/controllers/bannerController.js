import Banner from '~/models/bannerModel.js'
import { ApiError } from '~/utils/ApiError.js'


const getActiveBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ createdAt: -1 })
    res.status(200).json({
      status: 'success',
      data: banners
    })
  } catch (error) {
    next(error)
  }
}


const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).populate('createdBy', 'name email')
    res.status(200).json({
      status: 'success',
      data: banners
    })
  } catch (error) {
    next(error)
  }
}


const createBanner = async (req, res, next) => {
  try {
    const { message, type } = req.body

    if (!message || !message.trim()) {
      throw new ApiError(400, 'Nội dung banner không được để trống')
    }

    const banner = await Banner.create({
      message: message.trim(),
      type: type || 'info',
      active: true,
      createdBy: req.user._id
    })

    res.status(201).json({
      status: 'success',
      message: 'Tạo banner thành công',
      data: banner
    })
  } catch (error) {
    next(error)
  }
}


const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    const { active, message, type } = req.body

    const banner = await Banner.findById(id)
    if (!banner) throw new ApiError(404, 'Không tìm thấy banner')

    if (typeof active === 'boolean') banner.active = active
    if (message) banner.message = message.trim()
    if (type) banner.type = type

    await banner.save()

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật banner thành công',
      data: banner
    })
  } catch (error) {
    next(error)
  }
}


const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params
    const banner = await Banner.findByIdAndDelete(id)
    if (!banner) throw new ApiError(404, 'Không tìm thấy banner')

    res.status(200).json({
      status: 'success',
      message: 'Xóa banner thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const bannerController = {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
}