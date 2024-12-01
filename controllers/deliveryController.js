const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.delivery.findMany();

    return res.status(200).json({
      message: "All deliveries gotted sucessfully",
      deliveries: deliveries,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error getting all deliveries" });
  }
};

const getUnpaidDelivery = async (req, res) => {
  try {
    const paymentStatus = "unpaid";

    const unpaidDelivery = await prisma.delivery.findMany({
      where: {
        paymentStatus: paymentStatus,
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

const getUndeliveredDelivery = async (req, res) => {
  try {
    const deliveryStatus = "undelivered";

    const undeliveredDelivery = await prisma.delivery.findMany({
      where: {
        deliveryStatus: deliveryStatus,
      },
    });
    return res.status(200).json({
      message: "Undelivered delivery got sucessfully",
      undeliveredDelivery: undeliveredDelivery,
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

    const { protocol, origin, destination, scheduledAt } = req.body;

    const price = parseFloat(req.body.price);

    if (!protocol || !price || !origin || !destination || !scheduledAt) {
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

    let paymentStatus = "unpaid";
    let deliveryStatus = "undelivered";

    const delivery = await prisma.delivery.create({
      data: {
        carId: carId,
        protocol,
        price,
        fee,
        paymentStatus,
        deliveryStatus,
        origin,
        destination,
        scheduledAt: new Date(scheduledAt),
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

    const paymentStatus = "paid";

    const delivery = await prisma.delivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        paymentStatus: paymentStatus,
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

const updateDeliveryToDelivered = async (req, res) => {
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

    const deliveryStatus = "delivered";

    const delivery = await prisma.delivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        deliveryStatus: deliveryStatus,
      },
    });
    return res.status(200).json({
      message: `Delivery ${deliveryId} status updated to delivered sucessfully`,
      delivery: delivery,
    });
  } catch (error) {
    console.error("Error details", error);
    return res
      .status(500)
      .json({ message: `Error updating delivery ${deliveryId} to paid` });
  }
};

module.exports = {
  getAllDeliveries,
  getUnpaidDelivery,
  getUndeliveredDelivery,
  registerDelivery,
  updateDeliveryToPaid,
  updateDeliveryToDelivered,
};
