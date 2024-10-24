import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "El usuario es requerido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe de tener 8 caracteres como minimo"),
});

export const gradeSchema = z.object({
  grade: z.string().min(1, "El grado es requerido.").min(2, "Minimo 2 caracteres."),
  teacher: z.coerce.number().optional(),
});

export const subjectSchema = z.object({
  subject: z.string().min(1, "El nombre de la materia es requerido."),
});
const emailSchema = z
  .union([z.literal(""), z.string().email()])
  .transform((e) => (e === "" ? null : e));
export const parentEditSchema = z
  .object({
    fatherName: z.string().trim().optional().nullable(),
    fatherLastname: z
      .string({ required_error: "El apellido del padre es requerido." })
      .trim()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    fatherEmail: emailSchema,
    fatherPhone: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    motherName: z
      .string({ required_error: "El nombre de la madre es requerido." })
      .optional()
      .transform((e) => (e === "" ? null : e)),
    motherLastname: z
      .string({ required_error: "El apellido de la madre es requerido." })
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    motherEmail: emailSchema,
    motherPhone: z
      .string()
      .optional()
      .nullable()
      .transform((e) => (e === "" ? null : e)),
    username: z
      .string({ required_error: "Usuario es requerido" })
      .min(4, "El usuario debe de tener 4 caracteres como minimo")
      .transform((e) => (e === "" ? null : e)),
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .min(8, "La contraseña debe de tener 8 caracteres como minimo")
      .optional()
      .or(z.literal(""))
      .transform((e) => (e === "" ? null : e)),
  })
  .superRefine((values, ctx) => {
    if (!values.fatherName && !values.motherName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Se requiere un padre o una madre",
        path: ["fatherName"],
      });
    }
    if (values.fatherName && !values.fatherLastname) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Requerido",
        path: ["fatherLastname"],
      });
    }
    if (values.fatherName && !values.fatherEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Requerido",
        path: ["fatherEmail"],
      });
    }
    if (values.fatherName && !values.fatherPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Requerido",
        path: ["fatherPhone"],
      });
    }
    if (values.motherName && !values.motherLastname) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Requerido",
        path: ["motherLastname"],
      });
    }
    if (values.motherName && !values.motherEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Requerido",
        path: ["motherEmail"],
      });
    }
    if (values.motherName && !values.motherPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Requerido",
        path: ["motherPhone"],
      });
    }
  });

export const parentCreateSchema = z.intersection(
  parentEditSchema,
  z.object({
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .min(8, "La contraseña debe de tener 8 caracteres como minimo")
      .transform((e) => (e === "" ? null : e)),
  }),
);

export const teacherEditSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  lastname: z.string().min(1, "El apellido es requerido."),
  phone: z.string().min(1, "El numero de celular es requerido."),
  email: z.string().min(1, "El correo es requerido."),
  username: z.string().min(1, "El nombre de usuario es requerido."),
  dob: z.date(),
  grade: z.string().optional(),
  knownSubjects: z.array(z.string()).optional(),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(8, "La contraseña debe de tener 8 caracteres como minimo")
    .optional()
    .or(z.literal(""))
    .transform((e) => (e === "" ? null : e)),
});
export const teacherCreateSchema = z.intersection(
  teacherEditSchema,
  z.object({
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .min(8, "La contraseña debe de tener 8 caracteres como minimo")
      .transform((e) => (e === "" ? null : e)),
  }),
);

export const configSchema = z.object({
  year: z.string().min(1, "El año es requerido."),
  name: z.string().min(1, "El nombre es requerido."),
  gradeMax: z.number().min(1, "El máximo de grados es requerido."),
});

export const courseSchema = z.object({
  teacher: z.string({ required_error: "El profesor es requerido." }),
  subject: z.string({ required_error: "La materia es requerida." }),
  grade: z.string({ required_error: "El grado es requerido." }),
  day: z.string({ required_error: "El día es requerido." }),
  time: z.date({ required_error: "La hora es requerido." }),
});

export const addStudentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  lastname: z.string().min(1, "El apellido es requerido."),
  phone: z.string().min(1, "El numero de celular es requerido."),
  email: z.string().email("Correo invalido").min(1, "El correo es requerido."),
  dob: z.date(),
  grade: z.string(),
});

export const attendanceSchema = z.object({
  attendanceOption: z.string(),
});

const calification = z.coerce
  .string()
  .max(100)
  .transform((e) => (e === "" ? null : e));

export const calificationSchema = z.object({
  note1: calification,
  note2: calification,
  note3: calification,
  note4: calification,
  exam1: calification,
  note5: calification,
  note6: calification,
  note7: calification,
  note8: calification,
  exam2: calification,
  average1: calification,
  average2: calification,
});

export const reportSchema = z.object({
  description: z.string().min(1, "El reporte es requerido."),
});

export const postSchema = z.object({
  title: z.string().min(1, "El titulo es requerido."),
  description: z.string().min(1, "La descripcion es requerido."),
});
export const commentSchema = z.object({
  comment: z.string().min(1, "El comentario es requerido."),
});
