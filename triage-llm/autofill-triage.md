Use this document as a guide to triage autofill bugs.

Context: Bugs are reported to autofill in an Asana project called 'Autofill Bugs', in tasks. The tasks contain a domain usually and steps to reproduce. Your job is to triage this bug, and propose a fix either in the algorithm or via a remote rule in https://github.com/duckduckgo/privacy-configuration/. You can take a look at the [platform]-override.json files to see some examples of it by checking the siteSpecificFixes feature.

## Approach
Let's take a look at the high level approach I want to use for bug fixing. Essentially it will be done by comparing the page "visually" and labelling it (use your capabilities to do this visually) and compare that to the result that you get from the autofill algorithm/heuristics. Ideally the steps look like this:

1. Read the task and understand the bug.
2. Grab the website, and try to find the domain and the specific path that's causing the bug.
3. By looking at the dom visually, label the fields and buttons on the page. You can also look at the dom and try to understand the structure of the page, just don't use the autofill algorithm to do this, this is very important. You need to score this purely based on the visual inspection of the page, or by looking at the dom and understanding the structure of the page.
4. Once you have the labels, you can compare that to the result that you get from the autofill algorithm/heuristics, this can be done adding the page you just created in the previous step - to the test forms. Check the docs/real-world-html-tests.md file to see how to add a new form to the test suite.
5. If the result is different, you can propose a fix either in the algorithm or via a remote rule in https://github.com/duckduckgo/privacy-configuration/. The way to decide is - usually complexity. You don't want to add too much complexity to the algorithm, or worsen the test suite performance. If it the algorithm regresses in either of those ways, then simply add a remote rule in the privacy-configuration repository.
6. If the result is the same, you can comment that you couldn't reproduce it and add a label to the task.
