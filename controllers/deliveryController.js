const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerDelivery = async (req, res) => {
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

    const { protocol } = req.body;

    const price = parseFloat(req.body.price);

    if (!protocol || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const protocolExists = await prisma.delivery.findUnique({
      where: { protocol: protocol },
    });

    if (protocolExists) {
      return res
        .status(400)
        .json({ message: "Protocol number already exists" });
    }

    const fee = price * 0.7;

    let status = "Unpaid";

    const delivery = await prisma.delivery.create({
      data: {
        userId: userId,
        protocol,
        price,
        fee,
        status,
      },
    });
    return res
      .status(200)
      .json({ message: "Delivery created sucessfully", delivery: delivery });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error creating delivery" });
  }
};

module.exports = { registerDelivery };
