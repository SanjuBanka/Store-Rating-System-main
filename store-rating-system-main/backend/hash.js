const bcrypt = require("bcryptjs");

bcrypt.hash("Anuksha@123", 10)
.then(hash => {
    console.log(hash);
});