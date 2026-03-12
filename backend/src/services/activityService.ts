import prisma from "../config/prisma";

export const logActivity = async (type: string, description: string) => {
  try {
    await prisma.activity.create({
      data: {
        type,
        description,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
