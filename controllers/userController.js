require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");

const getTransportesUsers = async (req, res) => {
  try {
    const role = "transporter";

    const transporters = await prisma.user.findMany({
      where: {
        role: role,
      },
    });
    return res.status(200).json({
      message: "Get transportes sucessfully",
      transporters: transporters,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error getting transporter user" });
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        car: true,
        delivery: true,
      },
    });
    return res
      .status(200)
      .json({ message: `User ${userId} gotted sucessfully`, user: user });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: `Error getting user ${userId}` });
  }
};

const createTransporterUser = async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      password,
      confPassword,
      email,
      phone,
      state,
      city,
      neighborhood,
      postalCode,
    } = req.body;

    if (
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confPassword ||
      !email ||
      !phone ||
      !state ||
      !city ||
      !neighborhood ||
      !postalCode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone: phone },
    });
    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    let { workdays } = req.body;

    if (typeof workdays === "string") {
      try {
        workdays = JSON.parse(workdays);
      } catch (error) {
        return res.status(400).json({ message: "Invalid workdays format" });
      }
    }

    if (!Array.isArray(workdays) || workdays.length === 0) {
      console.log("Received workdays:", workdays);
      console.log("Type of workdays:", typeof workdays);
      return res
        .status(400)
        .json({ message: "Workdays must be a non-empty array of valid days" });
    }

    const validDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const isValidWorkdays = workdays.every((day) => validDays.includes(day));
    if (!isValidWorkdays) {
      return res.status(400).json({
        message:
          "Workdays must only include valid days like 'Monday', 'Tuesday', etc.",
      });
    }

    if (password !== confPassword) {
      return res
        .status(400)
        .json({ message: "Password must match password confirmation" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = "transporter";

    let profileImageUrl = "https://example.com/default-image.jpg";

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });
        profileImageUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res
          .status(400)
          .json({ message: "Failed to upload image", error: cloudinaryError });
      }
    }

    const newTransporterUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        password: hashedPassword,
        email,
        phone,
        state,
        city,
        neighborhood,
        postalCode,
        role,
        profileImage: profileImageUrl,
        workdays,
      },
    });

    return res
      .status(200)
      .json({ message: "User created successfully", user: newTransporterUser });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ message: "Error registering transporter user" });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const ADMIN_SECRET = process.env.ADMIN_SECRET;

    const { secret } = req.body;

    if (!secret) {
      return res.status(400).json({ message: "Secret is required" });
    }

    if (secret !== ADMIN_SECRET) {
      return res
        .status(401)
        .json({ message: "Permission to create an admin account denied" });
    }

    const {
      username,
      password,
      confPassword,
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    if (
      !username ||
      !password ||
      !confPassword ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone: phone },
    });
    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    if (password !== confPassword) {
      return res
        .status(400)
        .json({ message: "Password must match password confirmation" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = "admin";

    let profileImageUrl = "https://example.com/default-image.jpg";

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });
        profileImageUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res
          .status(400)
          .json({ message: "Failed to upload image", error: cloudinaryError });
      }
    }

    const newAdminUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        password: hashedPassword,
        email,
        phone,
        role,
        profileImage: profileImageUrl,
      },
    });
    return res
      .status(200)
      .json({ message: "User created successfully", user: newAdminUser });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error registering admin user" });
  }
};

const updateLocation = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const { state, city, neighborhood, postalCode } = req.body;

    if (!state || !city || !neighborhood || !postalCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        state: state,
        city: city,
        neighborhood: neighborhood,
        postalCode: postalCode,
      },
    });
    return res.status(200).json({
      message: `User ${userId} location updated sucessfully`,
      user: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating user ${userId} location` });
  }
};

const updateWorkDays = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let { workdays } = req.body;

    if (typeof workdays === "string") {
      try {
        workdays = JSON.parse(workdays);
      } catch (error) {
        return res.status(400).json({ message: "Invalid workdays format" });
      }
    }

    if (!Array.isArray(workdays) || workdays.length === 0) {
      console.log("Received workdays:", workdays);
      console.log("Type of workdays:", typeof workdays);
      return res
        .status(400)
        .json({ message: "Workdays must be a non-empty array of valid days" });
    }

    const validDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const isValidWorkdays = workdays.every((day) => validDays.includes(day));
    if (!isValidWorkdays) {
      return res.status(400).json({
        message:
          "Workdays must only include valid days like 'Monday', 'Tuesday', etc.",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        workdays: workdays,
      },
    });

    return res.status(200).json({
      message: `User ${userId} workdays updated sucessfully`,
      user: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating user ${userId} workdays` });
  }
};

const updatePhone = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "A phone number is required" });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        phone: phone,
      },
    });

    return res.status(200).json({
      message: `User ${userId} phone updated sucessfully`,
      user: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating user ${userId} phone` });
  }
};

const updateProfileImage = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "New profile image is required" });
    }

    let profileImageUrl = null;

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      profileImageUrl = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res
        .status(400)
        .json({ message: "Failed to upload image", error: cloudinaryError });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: profileImageUrl,
      },
    });
    return res.status(200).json({
      message: `User ${userId} profile image updated sucessfully`,
      user: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating user ${userId} profile image` });
  }
};

module.exports = {
  getTransportesUsers,
  getUserById,
  createTransporterUser,
  createAdminUser,
  updateLocation,
  updateWorkDays,
  updatePhone,
  updateProfileImage,
};
