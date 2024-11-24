const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUnpaidDelivery = async (req, res) => {
  try {
    const status = "Unpaid";

    const unpaidDelivery = await prisma.delivery.findMany({
      where: {
        status: status,
      },
    });
    return res.status(200).json({
      message: "Unpaid delivery got sucessfully",
      unpaidDelivery: unpaidDelivery,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error getting unpaid delivery" });
  }
};

const registerDelivery = async (req, res) => {
  const carId = parseInt(req.params.id, 10);
  try {
    if (isNaN(carId)) {
      return res.status(400).json({ message: "Invalid car id" });
    }

    const carExists = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!carExists) {
      return res.status(404).json({ message: "Car not found" });
    }

    const { protocol, origin, destination } = req.body;

    const price = parseFloat(req.body.price);

    if (!protocol || !price || !origin || !destination) {
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
        origin,
        destination,
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

const updateDeliveryToPaid = async (req, res) => {
  const deliveryId = parseInt(req.params.id, 10);
  try {
    if (isNaN(deliveryId)) {
      return res.status(400).json({ message: "Invalid delivery id" });
    }

    const deliveryExists = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    });

    if (!deliveryExists) {
      return res
        .status(404)
        .json({ message: `Delivery ${deliveryId} not found` });
    }

    const status = "paid";

    const delivery = await prisma.delivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        status: status,
      },
    });
    return res.status(200).json({
      message: `Delivery ${deliveryId} status updated to paid sucessfully`,
      delivery: delivery,
    });
  } catch (error) {
    console.error("Error details", error);
    return res
      .status(500)
      .json({ message: `Error updating delivery ${deliveryId} to paid` });
  }
};

module.exports = { getUnpaidDelivery, registerDelivery, updateDeliveryToPaid };
