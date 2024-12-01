require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createInitialManager = async () => {
  const MANAGER_SECRET = process.env.MANAGER_SECRET;

  if (!MANAGER_SECRET) {
    console.error(
      "MANAGER_SECRET is not defined in the environment variables."
    );
    process.exit(1);
  }

  const secret = process.argv[2];

  if (!secret) {
    console.error("Error: Secret is required as a script argument.");
    console.log("Usage: node initManager.js <secret>");
    process.exit(1);
  }

  if (secret !== MANAGER_SECRET) {
    console.error("Permission denied: Invalid secret.");
    process.exit(1);
  }

  const {
    INITIAL_MANAGER_USERNAME,
    INITIAL_MANAGER_PASSWORD,
    INITIAL_MANAGER_EMAIL,
    INITIAL_MANAGER_FIRST_NAME,
    INITIAL_MANAGER_LAST_NAME,
    INITIAL_MANAGER_TAX_DOCUMENT,
    INITIAL_MANAGER_PHONE,
  } = process.env;

  if (
    !INITIAL_MANAGER_USERNAME ||
    !INITIAL_MANAGER_PASSWORD ||
    !INITIAL_MANAGER_EMAIL ||
    !INITIAL_MANAGER_FIRST_NAME ||
    !INITIAL_MANAGER_LAST_NAME ||
    !INITIAL_MANAGER_TAX_DOCUMENT ||
    !INITIAL_MANAGER_PHONE
  ) {
    console.error(
      "Missing required environment variables for initial manager."
    );
    process.exit(1);
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: INITIAL_MANAGER_USERNAME },
    });

    if (existingUser) {
      console.log("A manager with this username already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(INITIAL_MANAGER_PASSWORD, 10);

    const newManager = await prisma.user.create({
      data: {
        username: INITIAL_MANAGER_USERNAME,
        firstName: INITIAL_MANAGER_FIRST_NAME,
        lastName: INITIAL_MANAGER_LAST_NAME,
        taxDocument: INITIAL_MANAGER_TAX_DOCUMENT,
        password: hashedPassword,
        email: INITIAL_MANAGER_EMAIL,
        phone: INITIAL_MANAGER_PHONE,
        role: "manager",
        profileImage: "https://example.com/default-image.jpg",
      },
    });

    console.log("Initial manager created successfully:", newManager);
  } catch (error) {
    console.error("Error creating initial manager:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createInitialManager();
