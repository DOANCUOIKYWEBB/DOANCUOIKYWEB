import Joi from 'joi'
import { ApiError } from '~/utils/ApiError.js'

/**
 * Xác thực dữ liệu đăng ký tài khoản (Signup)
 */
export const signupValidation = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().messages({
      'any.required': 'Họ tên là bắt buộc!',
      'string.empty': 'Họ tên không được phép để trống!',
      'string.min': 'Họ tên phải có ít nhất {#limit} ký tự!',
      'string.max': 'Họ tên không được vượt quá {#limit} ký tự!'
    }),
    email: Joi.string().required().email().trim().messages({
      'any.required': 'Email là bắt buộc!',
      'string.empty': 'Email không được phép để trống!',
      'string.email': 'Email không đúng định dạng hợp lệ!'
    }),
    password: Joi.string().required().min(6).trim().messages({
      'any.required': 'Mật khẩu là bắt buộc!',
      'string.empty': 'Mật khẩu không được phép để trống!',
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự!'
    })
  })

  try {
    // abortEarly: false để lấy ra tất cả lỗi thay vì dừng lại ở lỗi đầu tiên
    // allowUnknown: true để cho phép các trường dữ liệu khác không định nghĩa trong schema (nếu có)
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // Trích xuất thông điệp lỗi đầu tiên ném về Middleware xử lý lỗi tập trung
    const errorMessage = error.details.map(err => err.message).join(', ')
    next(new ApiError(422, errorMessage))
  }
}

/**
 * Xác thực dữ liệu đăng nhập (Login)
 */
export const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().messages({
      'any.required': 'Email là bắt buộc!',
      'string.empty': 'Email không được phép để trống!',
      'string.email': 'Email không đúng định dạng hợp lệ!'
    }),
    password: Joi.string().required().min(6).trim().messages({
      'any.required': 'Mật khẩu là bắt buộc!',
      'string.empty': 'Mật khẩu không được phép để trống!',
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự!'
    })
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(err => err.message).join(', ')
    next(new ApiError(422, errorMessage))
  }
}
