const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerCar = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (!userId) {
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

    const { registration, model, color } = req.body;

    if (!registration || !model || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const height = parseFloat(req.body.height);
    const width = parseFloat(req.body.width);
    const depth = parseFloat(req.body.depth);

    if (isNaN(height) || isNaN(width) || isNaN(depth)) {
      return res.status(400).json({ message: "Invalid dimensions" });
    }

    const car = await prisma.cars.create({
      data: {
        userId: userId,
        registration,
        model,
        color,
        height,
        width,
        depth,
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

module.exports = { registerCar };
