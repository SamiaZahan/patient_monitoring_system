const bcrypt = require('bcrypt');

(async () => {
  try {
    const salt = await bcrypt.genSalt(); // Use await to generate salt
    const hashedPassword = await bcrypt.hash("password5", salt); // Use await to hash the password with the salt
    console.log("Hashed password:", hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
})();
