import tf from '@tensorflow/tfjs-node';
import { readFileSync } from 'fs';
import { writeFileSync } from 'node:fs';
import { intoBooleans } from './utils.mjs';
import { inputFieldsSchema, trainingDataSchema } from './schema.mjs';

/**
 * @import json from './data/training-data.json';
 * @typedef {Omit<json[number], "type">} ItemWithoutLabel
 */

/**
 * @type {typeof json}
 */
const trainingData = JSON.parse(readFileSync('./data/training-data.json', 'utf8'));
const parsed = trainingDataSchema.parse(trainingData);

/**
 * @param {import('./schema.mjs').TrainingData} data
 */
function extractFeatures(data) {
    // Create vocabulary for text features
    const pageTitles = new Set();
    const pageHeadings = new Set();
    const formActions = new Set();

    data.forEach((example) => {
        pageTitles.add(example.page_title.toLowerCase());
        pageHeadings.add(example.page_heading.toLowerCase());
        formActions.add(example.form_action.toLowerCase());
    });

    // Convert to arrays for indexing
    const pageTitleVocab = Array.from(pageTitles);
    const pageHeadingVocab = Array.from(pageHeadings);
    const formActionVocab = Array.from(formActions);

    // Extract features and labels
    const features = data.map((example) => {
        // One-hot encode the text features
        const pageTitleIndex = pageTitleVocab.indexOf(example.page_title.toLowerCase());
        const pageHeadingIndex = pageHeadingVocab.indexOf(example.page_heading.toLowerCase());
        const formActionIndex = formActionVocab.indexOf(example.form_action.toLowerCase());

        // Create simple features from the form fields
        const formFields = inputFieldsSchema.parse(JSON.parse(example.input_fields_json));

        const booleans = intoBooleans(formFields);

        // Return feature vector
        return [pageTitleIndex, pageHeadingIndex, formActionIndex, ...booleans];
    });

    // Extract labels
    const labelClasses = [...new Set(data.map((example) => example.type))];
    const labels = data.map((example) => labelClasses.indexOf(example.type));

    return {
        features: tf.tensor2d(features),
        labels: tf.oneHot(tf.tensor1d(labels, 'int32'), labelClasses.length),
        labelClasses,
        metadata: {
            pageTitleVocab,
            pageHeadingVocab,
            formActionVocab,
        },
    };
}

// Create and train model
async function trainModel(features, labels) {
    // Create a model
    const model = tf.sequential();

    // Add layers
    model.add(
        tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: [features.shape[1]],
        }),
    );

    model.add(
        tf.layers.dense({
            units: 8,
            activation: 'relu',
        }),
    );

    model.add(
        tf.layers.dense({
            units: labels.shape[1],
            activation: 'softmax',
        }),
    );

    // Compile model
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    // Train model
    const history = await model.fit(features, labels, {
        epochs: 100,
        batchSize: 4,
        validationSplit: 0.2,
        shuffle: true,
    });

    return { model, history };
}

// Function to predict form type from YAML

// Main function
async function run() {
    try {
        console.log('Preparing training data...');
        // Process the training data
        const { features, labels, labelClasses, metadata } = extractFeatures(parsed);
        console.log('Training model...');
        // Train the model
        const { model } = await trainModel(features, labels);
        console.log('Saving model...');
        // Save model
        await model.save('file://./form-classifier-model');
        writeFileSync('./form-classifier-model/meta.json', JSON.stringify({ labelClasses, metadata }, null, 2));
        //
        //         console.log('Model trained and saved successfully!');
        //
        //         // Test prediction with an example
        //         const testYaml = `
        // page_title: 'Sign In'
        // page_heading: 'Welcome Back'
        // form:
        //   attributes:
        //     action: "/auth"
        //   elements:
        //     - type: 'input'
        //       attributes:
        //         name: 'email'
        //         placeholder: 'Email Address'
        //     - type: 'password'
        //       attributes:
        //         name: 'password'
        //         placeholder: 'Password'
        //     `;
        //
        //         console.log('Testing prediction with example form...');
        // const input = JSON.parse(readFileSync('./'));
        // const prediction = await predictFormType(model, input, metadata, labelClasses);
        // console.log('Prediction:', prediction);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the program
run();
