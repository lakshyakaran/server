import crypto from 'crypto'
import bcrypt from 'bcrypt'
import randtoken from 'rand-token'
import mongoose, { Schema } from 'mongoose'
import slug from 'mongoose-slug-generator'
import { env } from '../../config'

mongoose.plugin(slug, {
	separator: "",
	lang: "en",
	truncate: 120
})

const roles = ['user', 'admin']

const userSchema = new Schema({
	phone: {
		type: String,
		match: /^(\d{10})$/,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		match: /^\S+@\S+\.\S+$/,
		unique: true,
		trim: true,
		sparse: true,
		lowercase: true
	},
	role: {type: String, enum: roles, default: 'user'},
	slugName: {type: String, lowercase: true, required: true},
	userName: {type: String, slug: 'slugName', slug_padding_size: 3, unique: true},
	password: {type: String, required: true, minlength: 6},
	name: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	picture: {type: String, trim: true},
	services: {
		facebook: String,
		google: String
	},
}, {
	timestamps: true
})

userSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next()

		/* istanbul ignore next */
	const rounds = env === 'test' ? 1 : 9

	bcrypt.hash(this.password, rounds).then((hash) => {
		this.password = hash
		next()
	}).catch(next)
})

userSchema.methods = {
	view (full) {
		let view = {}
		let fields = ['id', 'name', 'picture']

		if (full) {
			fields = [...fields, 'phone', 'userName', 'email', 'createdAt']
		}

		fields.forEach((field) => { view[field] = this[field] })

		return view
	},

	authenticate (password) {
		return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
	}
}

userSchema.statics = {
	roles,

	createFromService ({ service, id, email, name, picture }) {
		return this.findOne({ $or: [{ [`services.${service}`]: id }, { phone }, { email }] }).then((user) => {
			if (user) {
				user.services[service] = id
				user.name = name
				user.picture = picture
				return user.save()
			} else {
				const password = randtoken.generate(16)
				return this.create({ services: { [service]: id }, email, password, name, picture })
			}
		})
	}
}

export const User = mongoose.model('User', userSchema)