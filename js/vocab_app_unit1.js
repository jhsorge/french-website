// js/vocab_app_unitX.js
document.addEventListener('DOMContentLoaded', () => {
    const currentUnitId = 'unit1'; // Set this dynamically for other units
    const unitVocabulary = getVocabularyForUnit(currentUnitId); // Full list for the unit

    let activeVocabularySet = []; // Holds user-selected words for flashcards/quiz

    // --- DOM Elements ---
    const wordSelectionSection = document.getElementById('word-selection-section');
    const wordListContainer = document.getElementById('word-list-container');
    const selectAllButton = document.getElementById('select-all-words-button');
    const deselectAllButton = document.getElementById('deselect-all-words-button');
    const startSelectedFlashcardsButton = document.getElementById('start-selected-flashcards-button');
    const backToWordSelectionButton = document.getElementById('back-to-word-selection');


    const flashcardsSection = document.getElementById('flashcards-section');
    const quizSection = document.getElementById('quiz-section'); // Assuming you have this section

    // Flashcard Elements
    const flashcard = document.querySelector('.flashcard');
    const frontTextElement = document.getElementById('flashcard-front-text');
    const backTextElement = document.getElementById('flashcard-back-text');
    const flashcardImageEl = document.getElementById('flashcard-image');
    const flashcardAudioButton = document.getElementById('flashcard-audio-button');
    const flipButton = document.getElementById('flip-flashcard');
    const prevButton = document.getElementById('prev-flashcard');
    const nextButton = document.getElementById('next-flashcard');
    const toggleLanguageButton = document.getElementById('toggle-language-button');

    let currentFlashcardIndex = 0;
    let flashcardAudio = null;
    let currentFlashcardMode = 'frenchFirst'; // 'frenchFirst' or 'germanFirst'

    // --- Populate Word Selection List ---
    function populateWordSelectionList() {
        if (!wordListContainer || !unitVocabulary || unitVocabulary.length === 0) {
            if(wordListContainer) wordListContainer.innerHTML = '<p>Aucun mot de vocabulaire à charger pour cette unité.</p>';
            if(startSelectedFlashcardsButton) startSelectedFlashcardsButton.disabled = true;
            if(selectAllButton) selectAllButton.disabled = true;
            if(deselectAllButton) deselectAllButton.disabled = true;
            return;
        }
        wordListContainer.innerHTML = ''; // Clear previous items

        unitVocabulary.forEach((item, index) => {
            const wordItemDiv = document.createElement('div');
            wordItemDiv.classList.add('word-item-select');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `vocab-checkbox-${index}`;
            checkbox.value = index; // Store index to easily retrieve the vocab item
            checkbox.checked = true; // Default to all selected

            const label = document.createElement('label');
            label.htmlFor = `vocab-checkbox-${index}`;

            const frenchSpan = document.createElement('span');
            frenchSpan.textContent = item.french;
            // Optionally, show German translation if available and filled in js/vocabulary.js
            // const germanSpan = document.createElement('span');
            // germanSpan.textContent = item.german !== "GERMAN_TRANSLATION_NEEDED" ? ` (${item.german})` : "";
            // germanSpan.style.fontSize = "0.9em";
            // germanSpan.style.color = "#555";

            label.appendChild(checkbox);
            label.appendChild(frenchSpan);
            // label.appendChild(germanSpan);
            wordItemDiv.appendChild(label);
            wordListContainer.appendChild(wordItemDiv);
        });
         if(startSelectedFlashcardsButton) startSelectedFlashcardsButton.disabled = false;
         if(selectAllButton) selectAllButton.disabled = false;
         if(deselectAllButton) deselectAllButton.disabled = false;
    }

    // --- Word Selection Event Listeners ---
    if (selectAllButton) {
        selectAllButton.addEventListener('click', () => {
            const checkboxes = wordListContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = true);
        });
    }

    if (deselectAllButton) {
        deselectAllButton.addEventListener('click', () => {
            const checkboxes = wordListContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        });
    }

    if (startSelectedFlashcardsButton) {
        startSelectedFlashcardsButton.addEventListener('click', () => {
            const selectedCheckboxes = wordListContainer.querySelectorAll('input[type="checkbox"]:checked');
            activeVocabularySet = [];
            selectedCheckboxes.forEach(checkbox => {
                activeVocabularySet.push(unitVocabulary[parseInt(checkbox.value)]);
            });

            if (activeVocabularySet.length === 0) {
                alert("Veuillez sélectionner au moins un mot pour commencer les flashcards !");
                return;
            }

            // Initialize and show flashcards
            currentFlashcardIndex = 0;
            displayFlashcard(currentFlashcardIndex); // Display the first selected card
            if (wordSelectionSection) wordSelectionSection.classList.add('hidden');
            if (flashcardsSection) flashcardsSection.classList.remove('hidden');

            // Optionally initialize and show quiz if it also uses activeVocabularySet
            // if (quizSection) quizSection.classList.remove('hidden');
            // initializeQuiz(); // You would need a function like this
        });
    }

    if (backToWordSelectionButton) {
        backToWordSelectionButton.addEventListener('click', () => {
            if (flashcardsSection) flashcardsSection.classList.add('hidden');
            if (quizSection) quizSection.classList.add('hidden'); // Also hide quiz if it was shown
            if (wordSelectionSection) wordSelectionSection.classList.remove('hidden');
            activeVocabularySet = []; // Clear the active set
        });
    }


    // --- Display Flashcard Function (Operates on activeVocabularySet) ---
    function displayFlashcard(index) {
        if (!flashcard || activeVocabularySet.length === 0) {
             if (flashcardsSection) flashcardsSection.innerHTML = "<p>Aucun mot sélectionné ou disponible pour les flashcards. <button id='back-to-select-again'>Retourner à la sélection</button></p>";
             document.getElementById('back-to-select-again')?.addEventListener('click', () => {
                if (flashcardsSection) flashcardsSection.classList.add('hidden');
                if (wordSelectionSection) wordSelectionSection.classList.remove('hidden');
             });
            return;
        }

        const item = activeVocabularySet[index];
        let termOnFront, termOnBack;

        if (currentFlashcardMode === 'frenchFirst') {
            termOnFront = item.french;
            termOnBack = item.german === "GERMAN_TRANSLATION_NEEDED" ? "(Traduction manquante)" : item.german;
        } else { // germanFirst
            termOnFront = item.german === "GERMAN_TRANSLATION_NEEDED" ? "(Traduction manquante)" : item.german;
            termOnBack = item.french;
        }

        frontTextElement.textContent = termOnFront;
        backTextElement.textContent = termOnBack;

        if (item.audio && item.audio !== "audio/vocab/placeholder.mp3") {
            flashcardAudioButton.style.display = 'inline-block';
            if (flashcardAudio) flashcardAudio.pause();
            flashcardAudio = new Audio(`../${item.audio}`);
        } else {
            flashcardAudioButton.style.display = 'none';
            flashcardAudio = null;
        }

        if (item.image && item.image !== "images/vocab/placeholder.png") {
            flashcardImageEl.src = `../${item.image}`;
            flashcardImageEl.style.display = 'block';
        } else {
            flashcardImageEl.style.display = 'none';
        }
        flashcard.classList.remove('flipped');
    }

    // --- Flashcard Event Listeners (Operate on activeVocabularySet) ---
    if (flashcard) { // Check if flashcard element exists
        // Initial call to displayFlashcard will happen after selection
        // displayFlashcard(currentFlashcardIndex);

        flipButton.addEventListener('click', () => flashcard.classList.toggle('flipped'));
        flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped')); // Click card to flip

        nextButton.addEventListener('click', () => {
            if (activeVocabularySet.length === 0) return;
            currentFlashcardIndex = (currentFlashcardIndex + 1) % activeVocabularySet.length;
            displayFlashcard(currentFlashcardIndex);
        });

        prevButton.addEventListener('click', () => {
            if (activeVocabularySet.length === 0) return;
            currentFlashcardIndex = (currentFlashcardIndex - 1 + activeVocabularySet.length) % activeVocabularySet.length;
            displayFlashcard(currentFlashcardIndex);
        });

        flashcardAudioButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (flashcardAudio) flashcardAudio.play();
        });

        toggleLanguageButton.addEventListener('click', () => {
            currentFlashcardMode = (currentFlashcardMode === 'frenchFirst') ? 'germanFirst' : 'frenchFirst';
            toggleLanguageButton.textContent = (currentFlashcardMode === 'frenchFirst') ? "Commencer par l'allemand" : "Commencer par le français";
            if (activeVocabularySet.length > 0) {
                displayFlashcard(currentFlashcardIndex);
            }
        });
    }

    // --- Initialize Page ---
    populateWordSelectionList(); // Populate the list as soon as the page loads

    // --- Quiz Logic (Example - adapt to use activeVocabularySet) ---
    const quizPromptWordEl = document.getElementById('quiz-prompt-word');
    const nextQuizQuestionButton = document.getElementById('next-quiz-question');
    let quizInitialized = false;

    function initializeQuiz() {
        if (activeVocabularySet.length < 1) { // Or a higher number like 4 for multiple choice
             if(quizSection) quizSection.innerHTML = "<p>Pas assez de mots sélectionnés pour le quiz.</p>";
            return;
        }
        quizInitialized = true;
        // Your existing quiz generation logic would go here, using activeVocabularySet
        // For example: generateQuizQuestion();
        console.log("Quiz initialized with " + activeVocabularySet.length + " words.");
        if(quizSection) quizSection.classList.remove('hidden'); // Show quiz section only if initialized
    }
    // Example: If you want the quiz to start when flashcards start
    // You can call initializeQuiz() inside the startSelectedFlashcardsButton listener,
    // or have a separate button to start the quiz.

    // Make sure to adapt your existing quiz functions (generateQuizQuestion, checkAnswer, etc.)
    // to use `activeVocabularySet` instead of `unitVocabulary`.
});
