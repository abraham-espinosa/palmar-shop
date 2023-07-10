import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Abraham Espinosa (Admin)',
    email: 'abrahamespi17@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Fany Martinez',
    email: 'fanymtz@egmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Alejandra Martinez',
    email: 'alemtzv6@gmail.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users