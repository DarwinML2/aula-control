"use server";

import { getYear } from "@/actions/school";
import prisma from "../../prisma/db";

type Course = {
  teacher: number;
  subject: number;
  grade: number;
  day: string;
  time: Date;
};
export async function getStudentNote(studentId: number, subjectId: number) {
  const year = await getYear();
  if (!year) return null;
  try {
    const result = await prisma.note.findFirst({
      where: { studentId, subjectId, year },
      include: { student: true, subject: true },
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getStudentNotes(studentId: number) {
  const year = await getYear();
  if (!year) return null;
  try {
    const result = await prisma.note.findMany({
      where: { studentId, year },
      include: { subject: true },
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getChartDataByStudent(studentId: number) {
  const year = await getYear();
  if (!year) return null;
  try {
    const notes = await prisma.note.findMany({
      select: { average1: true, average2: true },
      where: { studentId, year },
    });
    return notes;
  } catch (error) {
    console.log(error);
    return null;
  }
}
