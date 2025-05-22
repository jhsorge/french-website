// js/vocab_app.js
// Generic flashcard and quiz app for all units
// Usage: set <body data-unit="unitX"> or use ?unit=unitX in the URL

document.addEventListener('DOMContentLoaded', () => {
    // --- Get unitId from data attribute or query string ---
    function getUnitId() {
        // Try data attribute first
        const bodyUnit = document.body.getAttribute('data-unit');
        if (bodyUnit) return bodyUnit;
        // Fallback: check query string
        const params = new URLSearchParams(window.location.search);
        if (params.has('unit')) return params.get('unit');
        // Default fallback
        return 'unit1';
    }
    const currentUnitId = getUnitId();
    const unitVocabulary = getVocabularyForUnit(currentUnitId);

    let activeVocabularySet = [];

    // --- DOM Elements ---
    const wordSelectionSection = document.getElementById('word-selection-section');
    const wordListContainer = document.getElementById('word-list-container');
    const selectAllButton = document.getElementById('select-all-words-button');
    const deselectAllButton = document.getElementById('deselect-all-words-button');
    const startSelectedFlashcardsButton = document.getElementById('start-selected-flashcards-button');
    const backToWordSelectionButton = document.getElementById('back-to-word-selection');

    const flashcardsSection = document.getElementById('flashcards-section');
    const quizSection = document.getElementById('quiz-section');

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
    let currentFlashcardMode = 'frenchFirst';

    function populateWordSelectionList() {
        if (!wordListContainer || !unitVocabulary || unitVocabulary.length === 0) {
            if(wordListContainer) wordListContainer.innerHTML = '<p>Aucun mot de vocabulaire à charger pour cette unité.</p>';
            if(startSelectedFlashcardsButton) startSelectedFlashcardsButton.disabled = true;
            if(selectAllButton) selectAllButton.disabled = true;
            if(deselectAllButton) deselectAllButton.disabled = true;
            return;
        }
        wordListContainer.innerHTML = '';
        unitVocabulary.forEach((item, index) => {
            const wordItemDiv = document.createElement('div');
            wordItemDiv.classList.add('word-item-select');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `vocab-checkbox-${index}`;
            checkbox.value = index;
            checkbox.checked = true;
            const label = document.createElement('label');
            label.htmlFor = `vocab-checkbox-${index}`;
            const frenchSpan = document.createElement('span');
            frenchSpan.textContent = item.french;
            label.appendChild(checkbox);
            label.appendChild(frenchSpan);
            wordItemDiv.appendChild(label);
            wordListContainer.appendChild(wordItemDiv);
        });
        if(startSelectedFlashcardsButton) startSelectedFlashcardsButton.disabled = false;
        if(selectAllButton) selectAllButton.disabled = false;
        if(deselectAllButton) deselectAllButton.disabled = false;
    }

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
            currentFlashcardIndex = 0;
            displayFlashcard(currentFlashcardIndex);
            if (wordSelectionSection) wordSelectionSection.classList.add('hidden');
            if (flashcardsSection) flashcardsSection.classList.remove('hidden');
        });
    }
    if (backToWordSelectionButton) {
        backToWordSelectionButton.addEventListener('click', () => {
            if (flashcardsSection) flashcardsSection.classList.add('hidden');
            if (quizSection) quizSection.classList.add('hidden');
            if (wordSelectionSection) wordSelectionSection.classList.remove('hidden');
            activeVocabularySet = [];
        });
    }
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
            termOnBack = item.german;
        } else {
            termOnFront = item.german;
            termOnBack = item.french;
        }
        frontTextElement.textContent = termOnFront;
        backTextElement.textContent = termOnBack;
        if (flashcardImageEl) flashcardImageEl.style.display = 'none';
        if (flashcardAudioButton) flashcardAudioButton.style.display = 'none';
        flashcard.classList.remove('flipped');
    }
    if (flashcard) {
        flipButton.addEventListener('click', () => flashcard.classList.toggle('flipped'));
        flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
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
        });
        toggleLanguageButton.addEventListener('click', () => {
            currentFlashcardMode = (currentFlashcardMode === 'frenchFirst') ? 'germanFirst' : 'frenchFirst';
            toggleLanguageButton.textContent = (currentFlashcardMode === 'frenchFirst') ? "Commencer par l'allemand" : "Commencer par le français";
            if (activeVocabularySet.length > 0) {
                displayFlashcard(currentFlashcardIndex);
            }
        });
    }
    populateWordSelectionList();
    // Quiz logic can be added here if needed, using activeVocabularySet
});
