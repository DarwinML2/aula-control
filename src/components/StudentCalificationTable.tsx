"use client";
import { getStudentNotes } from "@/actions/notes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma, Student } from "@prisma/client";
import { useEffect, useState } from "react";

export default function StudentCalificationTable({ student }: { student: Student }) {
  const [notes, setNotes] = useState<Prisma.NoteGetPayload<{ include: { subject: true } }>[]>([]);
  useEffect(() => {
    getStudentNotes(student.id).then((notes) => {
      if (!notes) return;
      setNotes(notes);
    });
  }, [student]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="text-center" colSpan={5}>
              Primer cuatrimestre
            </TableHead>
            <TableHead className="text-center" colSpan={5}>
              Segundo cuatrimestre
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center">Materias</TableHead>
            <TableHead className="text-center">Nota 1</TableHead>
            <TableHead className="text-center">Nota 2</TableHead>
            <TableHead className="text-center">Nota 3</TableHead>
            <TableHead className="text-center">Nota 4</TableHead>
            <TableHead className="border-r text-center">Examen</TableHead>
            <TableHead className="text-center">Nota 1</TableHead>
            <TableHead className="text-center">Nota 2</TableHead>
            <TableHead className="text-center">Nota 3</TableHead>
            <TableHead className="text-center">Nota 4</TableHead>
            <TableHead className="text-center">Examen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes?.map((note) => (
            <>
              <TableRow className="text-center" key={note.id}>
                <TableCell>{note.subject.name}</TableCell>
                <TableCell>{note.note1}</TableCell>
                <TableCell>{note.note2}</TableCell>
                <TableCell>{note.note3}</TableCell>
                <TableCell>{note.note4}</TableCell>
                <TableCell>{note.exam1}</TableCell>
                <TableCell>{note.note5}</TableCell>
                <TableCell>{note.note6}</TableCell>
                <TableCell>{note.note7}</TableCell>
                <TableCell>{note.note8}</TableCell>
                <TableCell>{note.exam2}</TableCell>
              </TableRow>
              <TableRow className="text-center">
                <TableCell colSpan={5}>{note.average1 && `Promedio: ${note.average1}`}</TableCell>
                <TableCell colSpan={5}>{note.average2 && `Promedio: ${note.average2}`}</TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
