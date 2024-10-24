"use server";

import { getYear } from "@/actions/school";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/db";

type Course = {
  teacher: number;
  subject: number;
  grade: number;
  day: string;
  time: Date;
};
export async function createCourse({ teacher, subject, grade, day, time }: Course) {
  const year = await getYear();
  if (!year) return [];
  try {
    const result = await prisma.course.create({
      data: {
        teacherId: teacher,
        subjectId: subject,
        gradeId: grade,
        day,
        time,
        year,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function editCourse({ course, id }: { course: Course; id: number }) {
  const year = await getYear();
  if (!year) return false;
  try {
    const result = await prisma.course.update({
      data: {
        teacherId: course.teacher,
        subjectId: course.subject,
        gradeId: course.grade,
        day: course.day,
        time: course.time,
      },
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

export async function getCourseById(id: number) {
  try {
    const result = await prisma.course.findUnique({
      where: { id },
      include: { subject: true, grade: true, teacher: true },
    });
    return result;
  } catch (error) {
    return null;
    console.log(error);
  }
}

export async function getAllCoursesWithTrash(where?: Prisma.CourseWhereInput) {
  const year = await getYear();
  if (!year) return [];
  try {
    const result = await prisma.course.findMany({
      where: { year, ...where },
      include: { teacher: true, subject: true, grade: true },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getSubjectCourseById(id: number) {
  try {
    const result = prisma.course.findFirst({
      where: { id },
      include: { subject: { select: { id: true } } },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCoursesByTeacher(teacherId: number) {
  const year = await getYear();
  if (!year) return [];
  try {
    const result = await prisma.course.findMany({
      where: { teacherId, year },
      include: { subject: true, grade: true },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteCourse(id: number) {
  try {
    const result = await prisma.course.update({
      data: { deleteAt: new Date() },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function forceDeleteCourse(id: number) {
  try {
    const result = await prisma.course.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function restoreCourse(id: number) {
  try {
    const result = await prisma.course.update({
      data: { deleteAt: null },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
