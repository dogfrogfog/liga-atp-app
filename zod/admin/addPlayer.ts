import {z} from "zod";

export const AddPlayerSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    city: z.string(),
    country: z.string(),
    email: z.string().email(),
    phone: z.number(),
    age: z.number().positive(),
    gameplay_style: z.string(),
    forehand: z.string(),
    beckhand: z.string(),
    insta_link: z.string(),
    is_coach: z.boolean(),
    in_tennis_from: z.date(),
    job_description: z.string()

})
export type AddPlayerFormType = z.infer<typeof AddPlayerSchema>