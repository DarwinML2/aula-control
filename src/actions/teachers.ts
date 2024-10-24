"use server";

import { Prisma } from "@prisma/client";

import { RoleEnum } from "@/enums";
import { deleteAtDatetime } from "@/lib/utils";
import prisma from "../../prisma/db";
import { getYear } from "./school";

type TeacherSelectMany = Prisma.TeacherFindManyArgs["where"];

export async function getAllTeachers(where?: TeacherSelectMany) {
  const year = await getYear();
  if (!year) return [];
  try {
    const data = prisma.teacher.findMany({
      where: { year, deleteAt: null, ...where },
      include: { user: true },
    });
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getTeacherById(
  id: number,
  { include }: { include?: Prisma.TeacherInclude } = {},
) {
  const year = await getYear();
  if (!year) return false;
  try {
    const data = prisma.teacher.findUnique({
      where: { id },
      include,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getTeacherByUserId(id: number) {
  const year = await getYear();
  if (!year) return false;
  try {
    const data = prisma.teacher.findFirst({
      where: { user: { id } },
      include: {
        grade: true,
        user: true,
        Post: { include: { grade: true, teacher: true } },
        courses: { include: { subject: true, grade: true } },
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllTeachersWithTrash(where?: TeacherSelectMany) {
  const year = await getYear();
  if (!year) return false;
  try {
    const data = prisma.teacher.findMany({
      where: { year, ...where },
      include: { user: true, grade: true },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

type Teacher = {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  dob: Date;
  username: string;
  password?: string | null;
  knownSubjects?: string[];
  grade?: string;
};
export async function createTeacher({
  name,
  lastname,
  phone,
  email,
  dob,
  username,
  password,
  knownSubjects,
  grade,
}: Teacher) {
  const year = await getYear();
  if (!year) return false;
  try {
    const teacher = prisma.teacher.create({
      data: {
        name,
        lastname,
        phone,
        email,
        dob,
        knownSubjects: knownSubjects ?? [],
        grade: { connect: { name: grade } },
        year,
        user: {
          create: {
            username: username,
            password: password!,
            year,
            roleId: RoleEnum.TEACHER,
          },
        },
      },
    });
    return teacher;
  } catch (error) {
    console.log(error);
  }
}
export async function editTeacher({
  teacher: { name, lastname, phone, email, dob, username, password, knownSubjects, grade },
  id,
}: {
  teacher: Teacher;
  id: number;
}) {
  try {
    const userData: { username: string; password?: string } = {
      username: username!,
    };
    if (password) {
      userData.password = password;
    }
    const teacher = prisma.teacher.update({
      where: { id },
      data: {
        name,
        lastname,
        phone,
        email,
        dob,
        knownSubjects,
        grade: { connect: { name: grade } },
        user: {
          update: {
            data: {
              ...userData,
            },
          },
        },
      },
    });
    return teacher;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTeacher(id: number) {
  try {
    const result = await prisma.teacher.update({
      data: { deleteAt: deleteAtDatetime() },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function forceDeleteTeacher(id: number) {
  try {
    const result = await prisma.teacher.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function restoreTeacher(id: number) {
  try {
    const result = await prisma.teacher.update({
      data: { deleteAt: null },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
