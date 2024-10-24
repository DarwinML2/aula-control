"use client";

import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import PostCard from "./PostCard";

export default function PostList({
  isTeacher = true,
  posts,
}: {
  isTeacher?: boolean;
  posts: Prisma.PostGetPayload<{ include: { grade: true; teacher: true } }>[];
}) {
  const router = useRouter();
  //   const [posts, setPosts] = useState<Prisma.PostGetPayload<{ include: { grade: true } }>[]>([]);
  //   useEffect(() => {
  //     getPostsByTeacher(teacher.id).then((posts) => {
  //       setPosts(posts);
  //     });
  //   }, [teacher]);

  return (
    <div className="my-8 space-y-4">
      <h2 className="text-2xl font-semibold">Posts del profesor</h2>
      {posts.map((post) => (
        <PostCard isTeacher={isTeacher} key={post.id} post={post} />
      ))}
    </div>
  );
}
