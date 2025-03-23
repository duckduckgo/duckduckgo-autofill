// loadModel.mjs
import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import z from 'zod';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { intoBooleans } from './utils.mjs';
import { predictionSchema } from './schema.mjs';

// Convert ES module URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your model.json file
const modelPath = `file://${path.resolve(__dirname, './form-classifier-model/model.json')}`;
const meta = JSON.parse(readFileSync('./form-classifier-model/meta.json', 'utf8'));

// Load the model
const model = await tf.loadLayersModel(modelPath);

console.log('Model loaded successfully');
console.log('Model summary:');
model.summary();

/**
 * @param {import('./schema.mjs').PredictionForm} example
 */
async function loadModelAndPredict(example) {
    try {
        console.log('Loading model...');
        const v = await predictFormType(model, example, meta.metadata, meta.labelClasses);
        console.log(v);
    } catch (error) {
        console.error('Error loading model or making prediction:', error);
    }
}

// Execute the function
const examples = JSON.parse(readFileSync('./test-data/01.json', 'utf8'));
const parsed = z.array(predictionSchema).parse(examples);

for (const example of parsed) {
    console.log('-->', example.title);
    await loadModelAndPredict(example.data).catch(console.error);
}

/**
 * @param model
 * @param {import('./schema.mjs').PredictionForm} example
 * @param metadata
 * @param labelClasses
 */
async function predictFormType(model, example, metadata, labelClasses) {
    // Convert YAML to our format

    // Extract features using the same logic as training
    const pageTitleIndex = metadata.pageTitleVocab.indexOf(example.page_title.toLowerCase());
    const pageHeadingIndex = metadata.pageHeadingVocab.indexOf(example.page_heading.toLowerCase());
    const formActionIndex = metadata.formActionVocab.indexOf(example.form_action.toLowerCase());

    const booleans = intoBooleans(example.input_fields);

    // Create feature tensor
    const featureTensor = tf.tensor2d([[pageTitleIndex, pageHeadingIndex, formActionIndex, ...booleans]]);

    // Make prediction
    const prediction = model.predict(featureTensor);
    const predictionData = await prediction.data();

    // Get highest probability class
    const maxProbIndex = predictionData.indexOf(Math.max(...predictionData));
    const predictedClass = labelClasses[maxProbIndex];

    // Return prediction with confidence
    return {
        type: predictedClass,
        confidence: predictionData[maxProbIndex],
        allProbabilities: Array.from(predictionData).map((prob, index) => ({
            type: labelClasses[index],
            probability: prob,
        })),
    };
}
