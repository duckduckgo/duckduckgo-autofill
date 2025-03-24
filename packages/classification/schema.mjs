import { z } from 'zod';

const attributesSchema = z.object({
    placeholder: z.string().default(''),
});

const formFieldSchema = z.object({
    type: z.string(),
    label: z.string(),
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
    meta: z.object({
        name: z.string(),
    }),
});

export const trainingFormSchema = z.object({
    page_title: z.string().default('unknown title'),
    page_heading: z.string().default('unknown heading'),
    form_action: z.string().default('unknown action'),
    input_fields: z.array(formFieldSchema),
    type: z.enum(['login', 'signup', 'unknown']),
});
export const trainingDataSchema = z.array(trainingFormSchema);

export const predictionSchema = z.array(predictionFormSchema);
