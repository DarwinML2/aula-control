"use server";
import prisma from "../../prisma/db";
import { getYear } from "./school";

export async function getAllStudents() {
  try {
    const students = await prisma.student.findMany();
    return students;
  } catch (error) {
    console.log(error);
  }
}

export async function getStudentById(id: number) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { parent: true, grade: true },
    });
    return student;
  } catch (error) {
    console.log(error);
  }
}
export async function getStudentsByGradeId(gradeId: number) {
  const year = await getYear();
  if (!year) return [];
  try {
    const students = await prisma.student.findMany({
      where: { year, gradeId },
      include: { parent: true, grade: true, Note: true, Attendance: true, Report: true },
    });
    return students;
  } catch (error) {
    console.log(error);
    return [];
  }
}

type CreateStudent = {
  student: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    dob: Date;
    grade: number;
  };
  parentId: number;
};
export async function createStudent({
  student: { name, lastname, phone, email, dob, grade },
  parentId,
}: CreateStudent) {
  const year = await getYear();
  if (!year) return [];

  try {
    const student = await prisma.student.create({
      data: {
        parentId,
        name,
        lastname,
        phone,
        email,
        dob,
        gradeId: grade,
        year,
      },
    });
    return student;
  } catch (error) {
    console.log({ "error creating student": error });
  }
}

type EditStudent = {
  student: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    dob: Date;
    grade: number;
  };
  id: number;
};
export async function editStudent({
  student: { name, lastname, phone, email, dob, grade },
  id,
}: EditStudent) {
  try {
    const student = await prisma.student.update({
      where: { id },
      data: {
        name,
        lastname,
        phone,
        email,
        dob,
        gradeId: grade,
      },
    });
    return student;
  } catch (error) {
    console.log({ "error creating student": error });
  }
}

export async function deleteStudent(id: number) {
  try {
    const result = await prisma.student.update({
      data: { deleteAt: new Date() },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function forceDeleteStudent(id: number) {
  try {
    const result = await prisma.student.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function restoreStudent(id: number) {
  try {
    const result = await prisma.student.update({
      data: { deleteAt: null },
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addNoteToStudent({
  studentId,
  subjectId,
  note1,
  note2,
  note3,
  note4,
  exam1,
  note5,
  note6,
  note7,
  note8,
  exam2,
  average1,
  average2,
}: {
  studentId: number;
  subjectId: number;
  note1: number | null;
  note2: number | null;
  note3: number | null;
  note4: number | null;
  exam1: number | null;
  note5: number | null;
  note6: number | null;
  note7: number | null;
  note8: number | null;
  exam2: number | null;
  average1: number | null;
  average2: number | null;
}) {
  const year = await getYear();
  if (!year) return;

  try {
    const note = await prisma.note.findFirst({
      where: { studentId, subjectId, year },
    });
    if (note) {
      const result = await prisma.note.update({
        where: { id: note.id },
        data: {
          note1,
          note2,
          note3,
          note4,
          exam1,
          note5,
          note6,
          note7,
          note8,
          exam2,
          average1,
          average2,
        },
      });
      return result;
    } else {
      const result = await prisma.note.create({
        data: {
          studentId,
          subjectId,
          year,
          note1,
          note2,
          note3,
          note4,
          exam1,
          note5,
          note6,
          note7,
          note8,
          exam2,
          average1,
          average2,
        },
      });
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addReportToStudent({
  studentId,
  description,
}: {
  studentId: number;
  description: string;
}) {
  const year = await getYear();
  if (!year) return;

  try {
    const result = await prisma.report.create({
      data: {
        studentId,
        description,
        date: new Date(),
        year,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getReportsByStudent(studentId: number) {
  const year = await getYear();
  if (!year) return [];
  try {
    const result = await prisma.report.findMany({
      where: { studentId, year },
      orderBy: { id: "desc" },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteReport(id: number) {
  try {
    const result = await prisma.report.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
export async function getStudentsByFamilyId(familyId: number) {
  const year = await getYear();
  if (!year) return [];
  try {
    const students = await prisma.student.findMany({
      where: { parentId: familyId, year },
      include: { grade: true },
    });
    return students;
  } catch (error) {
    console.log(error);
    return [];
  }
}
