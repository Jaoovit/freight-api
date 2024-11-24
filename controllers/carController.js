const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");

const getCarById = async (req, res) => {
  const carId = parseInt(req.params.id, 10);

  try {
    if (isNaN(carId)) {
      return res.status(400).json({
        message: "Invalid car id",
      });
    }

    const carExist = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!carExist) {
      return res.status(400).json({
        message: "Car not found",
      });
    }

    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
      include: {
        delivery: true,
      },
    });
    return res
      .status(200)
      .json({ message: `Car ${carId} got sucessfully`, car: car });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: `Error getting can ${carId}` });
  }
};

const registerCar = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      include: { car: true },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userCarsLength = userExists.car.length;

    if (userCarsLength > 4) {
      return res
        .status(401)
        .json({ message: "User cannot have more than 5 registered cars" });
    }

    const { registration, model, color, category, year } = req.body;

    const existingRegistration = await prisma.car.findUnique({
      where: { registration: registration },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Registration already exists" });
    }

    if (!registration || !model || !color || !category || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const height = parseFloat(req.body.height);
    const width = parseFloat(req.body.width);
    const depth = parseFloat(req.body.depth);

    if (isNaN(height) || isNaN(width) || isNaN(depth)) {
      return res.status(400).json({ message: "Invalid dimensions" });
    }

    const capacity = parseFloat(req.body.capacity);

    if (isNaN(capacity)) {
      return res.status(400).json({ message: "Invalid capacity" });
    }

    if (!height || !width || !depth || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const images = req.files;

    if (images.length > 5) {
      return res
        .status(400)
        .json({ message: "You can upload a maximum of 5 images" });
    }

    let imageUrls = [];
    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          })
          .end(image.buffer);
      });
    });

    imageUrls = await Promise.all(uploadPromises);

    const car = await prisma.car.create({
      data: {
        userId: userId,
        registration,
        model,
        color,
        height,
        width,
        depth,
        capacity,
        category,
        year,
        carImage: {
          create: imageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Car regristered sucessfully", car: car });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error registering a car" });
  }
};

const updateCarSize = async (req, res) => {
  const carId = parseInt(req.params.id, 10);

  try {
    if (isNaN(carId)) {
      return res.status(400).json({ message: "Invalid car id" });
    }

    const carExist = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!carExist) {
      return res.status(404).json({ message: "Car not found" });
    }

    const height = parseFloat(req.body.height);
    const width = parseFloat(req.body.width);
    const depth = parseFloat(req.body.depth);

    if (isNaN(height) || isNaN(width) || isNaN(depth)) {
      return res.status(400).json({ message: "Invalid dimensions" });
    }

    if (!height || !width || !depth) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const car = await prisma.car.update({
      where: {
        id: carId,
      },
      data: {
        height: height,
        width: width,
        depth: depth,
      },
    });
    return res
      .status(200)
      .json({ message: `Car ${carId} updated sucessfully`, car: car });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: `Error updating car ${carId}` });
  }
};

const deleteCar = async (req, res) => {
  const carId = parseInt(req.params.id, 10);
  try {
    if (isNaN(carId)) {
      return res.status(400).json({ message: "Invalid car id" });
    }

    const carExist = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!carExist) {
      return res.status(404).json({ message: "Car not found" });
    }

    await prisma.car.delete({
      where: {
        id: carId,
      },
    });
    return res
      .status(200)
      .json({ message: `Car ${carId} deleted sucessfully` });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: `Error deleting car ${carId}` });
  }
};

module.exports = { getCarById, registerCar, updateCarSize, deleteCar };
