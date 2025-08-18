const bcrypt = require('bcrypt');
console.log(bcrypt.hashSync('Pass@1234', 10));