"use server";

import { deleteAtDatetime } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/db";
type SubjectSelect = Prisma.Args<typeof prisma.subject, "findFirst">["where"];

export async function createSubject({ subject }: { subject: string }) {
  try {
    const result = await prisma.subject.create({ data: { name: subject } });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function editSubject({
  subject,
  id,
}: {
  subject: string;

  id: number;
}) {
  try {
    const result = await prisma.subject.update({
      data: { name: subject },
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

export async function getSubjectById(id: number) {
  try {
    const result = await prisma.subject.findUnique({ where: { id } });
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllSubjects(where?: SubjectSelect) {
  try {
    const result = await prisma.subject.findMany({ where: { deleteAt: null, ...where } });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getAllSubjectsWithTrash(where?: SubjectSelect) {
  try {
    const result = await prisma.subject.findMany({ where: { ...where } });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteSubject(id: number) {
  try {
    const result = await prisma.subject.update({
      data: { deleteAt: deleteAtDatetime() },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function restoreSubject(id: number) {
  try {
    const result = await prisma.subject.update({
      data: { deleteAt: null },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function forceDeleteSubject(id: number) {
  try {
    const result = await prisma.subject.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
