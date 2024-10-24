"use server";

import { Prisma } from "@prisma/client";
import prisma from "../../prisma/db";

export async function getYear() {
  try {
    const result = await prisma.school.findFirst({ select: { year: true } });
    if (result) return result.year;
    return null;
  } catch (error) {
    return "24-25";
  }
}
export async function getConfig() {
  try {
    const result = await prisma.school.findFirst();
    return result;
  } catch (error) {
    return null;
  }
}
export async function updateCondfig(id: number, data: Prisma.SchoolUpdateInput) {
  try {
    const result = await prisma.school.update({
      data,
      where: {
        id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
