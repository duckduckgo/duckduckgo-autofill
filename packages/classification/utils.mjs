/**
 * @param formFields
 * @returns {number[]}
 */
export function intoBooleans(formFields) {
    // Create simple features from the form fields

    // Count of each field type
    const fieldTypeCounts = {};
    formFields.forEach((field) => {
        fieldTypeCounts[field.type] = (fieldTypeCounts[field.type] || 0) + 1;
    });

    // Basic features about the form structure
    const numFields = formFields.length;
    const hasPasswordField = fieldTypeCounts.password > 0;
    const hasMultiplePasswordFields = (fieldTypeCounts.password || 0) > 1;
    const hasEmailField = formFields.some(
        (field) =>
            field.name.includes('email') || (field.attributes.placeholder && field.attributes.placeholder.toLowerCase().includes('email')),
    );

    // Simple bag-of-words for all field names and placeholders
    const fieldText = formFields
        .map((field) => `${field.type} ${field.name} ${field.attributes.placeholder}`)
        .join(' ')
        .toLowerCase();

    const hasNameField = fieldText.includes('name');
    const hasConfirmField = fieldText.includes('confirm');

    // Return feature vector
    return [
        numFields,
        hasPasswordField ? 1 : 0,
        hasMultiplePasswordFields ? 1 : 0,
        hasEmailField ? 1 : 0,
        hasNameField ? 1 : 0,
        hasConfirmField ? 1 : 0,
    ];
}
