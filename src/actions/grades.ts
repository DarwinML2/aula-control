"use server";

import { deleteAtDatetime } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/db";
import { getYear } from "./school";
type GradeSelect = Prisma.Args<typeof prisma.grade, "findFirst">["where"];

export async function createGrade({ grade, teacher }: { grade: string; teacher?: number | null }) {
  const year = await getYear();
  if (!year) return false;
  try {
    const result = await prisma.grade.create({ data: { name: grade, teacherId: teacher, year } });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function editGrade({
  grade,
  teacher,
  id,
}: {
  grade: string;
  teacher?: number | null;
  id: number;
}) {
  const year = await getYear();
  if (!year) return false;
  try {
    const result = await prisma.grade.update({
      data: { name: grade, teacherId: teacher, year },
      where: {
        id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getGradeById(id: number) {
  try {
    const result = await prisma.grade.findUnique({ where: { id } });
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllGrades(where?: GradeSelect) {
  const year = await getYear();
  if (!year) return [];
  try {
    const result = await prisma.grade.findMany({ where: { year, deleteAt: null, ...where } });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getAllGradesWithTrash(where?: GradeSelect) {
  const year = await getYear();
  if (!year) return false;
  try {
    const result = await prisma.grade.findMany({ where: { year, ...where } });
    return result;
  } catch (error) {
    return [];
    console.log(error);
  }
}

export async function deleteGrade(id: number) {
  try {
    const result = await prisma.grade.update({
      data: { deleteAt: deleteAtDatetime() },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function restoreGrade(id: number) {
  try {
    const result = await prisma.grade.update({
      data: { deleteAt: null },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function forceDeleteGrade(id: number) {
  try {
    const result = await prisma.grade.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
