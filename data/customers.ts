import { db } from "@/lib/db";
import { Customer } from "@prisma/client";

export const getCustomerByName = async (name: string, userId: string): Promise<Customer | null> => {
  try {
    return await db.customer.findFirst({
      where: { name, createdByUserId: userId } // Assuming 'name' is actually an 'id' or adjust accordingly
    });
  } catch (error) {
    console.error("Error fetching customer by name:", error);
    return null;
  }
};

export const getCustomerById = async (id: string, userId: string): Promise<Customer | null> => {
  try {
    return await db.customer.findUnique({
      where: { id, createdByUserId: userId }
    });
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return null;
  }
};