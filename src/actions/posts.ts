"use server";
import { AuthorModel } from "@prisma/client";
import prisma from "../../prisma/db";
import { getYear } from "./school";

type Post = {
  title: string;
  description: string;
  teacherId: number;
  gradeId: string;
};
export async function getPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { grade: true, Comment: { orderBy: { id: "desc" } }, teacher: true },
    });
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostsByGradeId(gradeName: string | string[]) {
  const year = await getYear();
  if (!year) return [];
  const grades = Array.isArray(gradeName) ? gradeName : [gradeName];
  const where = Array.isArray(gradeName) ? { gradeId: { in: grades } } : { gradeId: gradeName };
  console.log(where);
  try {
    const posts = await prisma.post.findMany({
      where: { ...where, year },
      include: { grade: true, teacher: true },
    });
    console.log(posts);
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function createPost({ title, description, teacherId, gradeId }: Post) {
  const year = await getYear();
  if (!year) return null;
  try {
    const post = await prisma.post.create({
      data: {
        gradeId,
        teacherId,
        title,
        description,
        year,
      },
    });
    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getPostsByTeacher(teacherId: number) {
  const year = await getYear();
  if (!year) return [];
  try {
    const posts = await prisma.post.findMany({
      where: { teacherId, year },
      include: { grade: true },
      orderBy: { id: "desc" },
    });
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deletePost(id: number) {
  try {
    const result = await prisma.post.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment({
  comment,
  postId,
  authorId,
  authorModel,
}: {
  comment: string;
  postId: number;
  authorId: number;
  authorModel: AuthorModel;
}) {
  try {
    const result = await prisma.comment.create({
      data: {
        authorId,
        authorModel,
        postId,
        comment,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteComment(id: number) {
  try {
    const result = prisma.comment.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
