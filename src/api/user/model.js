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
const userType = ['STUDENT', 'TEACHER', 'INSTITUTE']

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
	userType: {type: String, enum: userType, default: 'STUDENT'},
	slugName: {type: String, lowercase: true, required: true},
	userName: {type: String, slug: 'slugName', slug_padding_size: 3, unique: true},
	password: {type: String, required: true, minlength: 6},
	name: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	picture: {type: String, trim: true},
	basicInfo: { type: String, default: ''},
	education: [{
		degree: {type: String, ref: 'Degree', required: true},
		school: {type: String, ref: 'School', required: true},
		field: String,
		start: Number,
		end: Number,
		isCurrent: {type: Boolean, default: false}
	}],
	experience: [{
		company: {type: String, required: true},
		designation: {type: String, required: true},
		start: Number,
		end: Number,
		isCurrent: {type: Boolean, default: false}
	}],
	topic: [{type: String, ref: 'Topic', required: true}],
	teachers: [{type: String, ref: 'User', required: true}],
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
		let fields = ['id', 'name', 'picture', 'basicInfo', 'education', 'experience']
		if(this.userType !== 'STUDENT'){
			fields.push('topic')
		}
		if(this.userType === 'INSTITUTE'){
			fields.push('teachers')
		}

		if (full) {
			fields = [...fields, 'phone', 'userType', 'userName', 'email', 'createdAt']
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