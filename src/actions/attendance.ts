"use server";

import prisma from "../../prisma/db";
import { getYear } from "./school";
export async function getAttendanceOptions() {
  try {
    const attendanceOptions = await prisma.attendanceOption.findMany();
    return attendanceOptions;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addAttendanceToStudent({
  studentId,
  attendanceOptionId,
  courseId,
}: {
  studentId: number;
  attendanceOptionId: string;
  courseId: number;
}) {
  const year = await getYear();
  if (!year) return;
  try {
    const result = await prisma.attendance.create({
      data: {
        studentId,
        attendanceOptionId,
        courseId,
        year,
        date: new Date(),
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function editAttendanceToStudent({
  attendanceId,
  attendanceOptionId,
  courseId,
}: {
  attendanceId: number;
  attendanceOptionId: string;
  courseId: number;
}) {
  const year = await getYear();
  if (!year) return;
  try {
    const result = await prisma.attendance.update({
      data: {
        attendanceOptionId,
        courseId,
        year,
      },
      where: {
        id: attendanceId,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
