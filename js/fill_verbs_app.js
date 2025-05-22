// js/fill_verbs_app.js
document.addEventListener('DOMContentLoaded', () => {
    // Assumes sentenceFillDataUnit1 is loaded globally from fill_verbs_data_unit1.js
    if (typeof sentenceFillDataUnit1 === 'undefined' || sentenceFillDataUnit1.length === 0) {
        const sentencesContainer = document.getElementById('sentences-container');
        if (sentencesContainer) sentencesContainer.innerHTML = '<p>Aucune phrase à charger. Vérifiez <code>js/fill_verbs_data_unit1.js</code>.</p>';
        const verifyButton = document.getElementById('verify-sentences-button');
        if (verifyButton) verifyButton.disabled = true;
        return;
    }

    const sentencesContainer = document.getElementById('sentences-container');
    const verifyButton = document.getElementById('verify-sentences-button');
    const resultsContainer = document.getElementById('results-container');

    let displayedSentencesData = []; // To keep track of the data for displayed sentences and their dropdowns

    function displaySentences() {
        sentencesContainer.innerHTML = ''; // Clear previous content or loading message
        displayedSentencesData = []; // Reset

        // For this version, we display all 5 sentences from sentenceFillDataUnit1
        const currentSet = sentenceFillDataUnit1; // In future, could select sets

        currentSet.forEach((sentenceData, sentenceIndex) => {
            const sentenceBlockDiv = document.createElement('div');
            sentenceBlockDiv.classList.add('sentence-block');
            sentenceBlockDiv.dataset.sentenceId = sentenceData.id;

            let gapIndexInSentence = 0; // To create unique IDs for dropdowns within this sentence
            const sentencePartsInfo = []; // To store info about dropdowns for this sentence

            sentenceData.segments.forEach(segment => {
                if (segment.type === "text") {
                    const textSpan = document.createElement('span');
                    textSpan.classList.add('text-segment');
                    textSpan.textContent = segment.content;
                    sentenceBlockDiv.appendChild(textSpan);
                } else if (segment.type === "dropdown") {
                    const selectElement = document.createElement('select');
                    selectElement.classList.add('verb-form-select');
                    selectElement.classList.add('default-option'); // For initial styling
                    // Unique ID for each dropdown: sentence index - gap index
                    const dropdownId = `s${sentenceIndex}-g${gapIndexInSentence}`;
                    selectElement.id = dropdownId;

                    // Add a default, non-selectable first option
                    const defaultOption = document.createElement('option');
                    defaultOption.textContent = segment.placeholder || "-- verbe --";
                    defaultOption.value = ""; // Important: value is empty
                    selectElement.appendChild(defaultOption);

                    segment.options.forEach(optionText => {
                        const option = document.createElement('option');
                        option.value = optionText;
                        option.textContent = optionText;
                        selectElement.appendChild(option);
                    });

                    selectElement.addEventListener('change', () => {
                        if (selectElement.value === "") {
                            selectElement.classList.add('default-option');
                        } else {
                            selectElement.classList.remove('default-option');
                        }
                    });

                    sentenceBlockDiv.appendChild(selectElement);

                    // Add a span for inline feedback icon (initially empty)
                    const feedbackSpan = document.createElement('span');
                    feedbackSpan.classList.add('feedback-icon-inline');
                    feedbackSpan.id = `feedback-${dropdownId}`;
                    sentenceBlockDiv.appendChild(feedbackSpan);

                    sentencePartsInfo.push({
                        dropdownId: dropdownId,
                        correctAnswer: segment.correctAnswer
                    });
                    gapIndexInSentence++;
                }
            });
            sentencesContainer.appendChild(sentenceBlockDiv);
            displayedSentencesData.push({ sentenceId: sentenceData.id, gaps: sentencePartsInfo });
        });
        verifyButton.disabled = false;
        resultsContainer.innerHTML = ''; // Clear previous results
    }

    verifyButton.addEventListener('click', () => {
        let totalCorrect = 0;
        let totalGaps = 0;

        displayedSentencesData.forEach(sentenceInfo => {
            sentenceInfo.gaps.forEach(gapInfo => {
                totalGaps++;
                const dropdownElement = document.getElementById(gapInfo.dropdownId);
                const feedbackElement = document.getElementById(`feedback-${gapInfo.dropdownId}`);
                
                dropdownElement.classList.remove('correct', 'incorrect', 'default-option');
                if (feedbackElement) feedbackElement.textContent = '';
                if (feedbackElement) feedbackElement.classList.remove('correct', 'incorrect');


                if (dropdownElement.value === "") { // No answer selected
                    dropdownElement.classList.add('incorrect'); // Mark as incorrect if not answered
                    if (feedbackElement) {
                        feedbackElement.textContent = '✘';
                        feedbackElement.classList.add('incorrect');
                    }
                } else if (dropdownElement.value.toLowerCase() === gapInfo.correctAnswer.toLowerCase()) {
                    dropdownElement.classList.add('correct');
                    if (feedbackElement) {
                        feedbackElement.textContent = '✔';
                        feedbackElement.classList.add('correct');
                    }
                    totalCorrect++;
                } else {
                    dropdownElement.classList.add('incorrect');
                    if (feedbackElement) {
                        feedbackElement.textContent = '✘';
                        feedbackElement.classList.add('incorrect');
                    }
                }
            });
        });

        resultsContainer.innerHTML = ''; // Clear previous results before adding new one
        const resultMessage = document.createElement('p');
        if (totalCorrect === totalGaps) {
            resultMessage.textContent = `Super! Tu as tout correct (${totalCorrect}/${totalGaps})!`;
            resultMessage.classList.add('success');
        } else {
            resultMessage.textContent = `Résultat : ${totalCorrect} sur ${totalGaps} correct. Essaie encore!`;
            resultMessage.classList.add('failure');
        }
        resultsContainer.appendChild(resultMessage);
    });

    // Initial display of sentences
    displaySentences();
});
