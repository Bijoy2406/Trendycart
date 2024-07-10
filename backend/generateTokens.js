// Import jsonwebtoken and UserToken model
import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";

// Define a function to generate tokens
const generateTokens = async (user) => {
  try {
    // Create a payload with user id and roles
    const payload = {
      _id: user._id,
      roles: user.roles,
    };

    // Generate an access token with a short expiration time
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "14m" }
    );

    // Generate a refresh token with a longer expiration time
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "30d" }
    );

    // Find and remove any existing refresh token for the user
    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await userToken.remove();

    // Save the new refresh token in the database
    await new UserToken({ userId: user._id, token: refreshToken }).save();

    // Return both tokens as an object
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    // Handle any errors
    return Promise.reject(err);
  }
};

// Export the function
export default generateTokens;
