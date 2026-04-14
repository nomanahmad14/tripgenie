import authService from "../services/authService.js";


const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};



export default { register, login };

