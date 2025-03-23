import { z } from 'zod';

const attributesSchema = z.object({
    placeholder: z.string().default(''),
});

const formFieldSchema = z.object({
    type: z.enum(['text', 'password']),
    name: z.string(),
    attributes: attributesSchema,
});

export const inputFieldsSchema = z.array(formFieldSchema);

/**
 * @typedef {import("zod").infer<typeof inputFieldsSchema>} InputFields
 * @typedef {import("zod").infer<typeof trainingDataSchema>} TrainingData
 * @typedef {import("zod").infer<typeof predictionFormSchema>} PredictionForm
 */

export const predictionFormSchema = z.object({
    page_title: z.string().default('unknown title'),
    page_heading: z.string().default('unknown heading'),
    form_action: z.string().default('unknown action'),
    input_fields: z.array(formFieldSchema),
});

export const trainingFormSchema = z.object({
    page_title: z.string().default('unknown title'),
    page_heading: z.string().default('unknown heading'),
    form_action: z.string().default('unknown action'),
    input_fields_json: z.string().default('{}'),
    type: z.enum(['login', 'signup', 'unknown']),
});
export const trainingDataSchema = z.array(trainingFormSchema);

export const predictionSchema = z.object({
    title: z.string(),
    data: predictionFormSchema,
});
