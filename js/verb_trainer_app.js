// js/verb_trainer_app.js
// Generic verb trainer app for all units
// Usage: call initVerbTrainerApp(verbsArray) from your HTML page with the correct verbs array

function initVerbTrainerApp(verbsArray) {
    const verbCheckboxList = document.getElementById('verb-checkbox-list');
    const startPracticeButton = document.getElementById('start-practice-button');
    const verbSelectionArea = document.getElementById('verb-selection-area');
    const verbPracticeForms = document.getElementById('verb-practice-forms');
    const conjugationTablesContainer = document.getElementById('conjugation-tables-container');
    const backToVerbSelectionButtonVT = document.getElementById('back-to-verb-selection-vt');
    const pronouns = ["je", "tu", "il_elle_on", "nous", "vous", "ils_elles"];
    const pronounDisplayMap = {
        "je": "je / j'",
        "tu": "tu",
        "il_elle_on": "il / elle / on",
        "nous": "nous",
        "vous": "vous",
        "ils_elles": "ils / elles"
    };
    let selectedVerbObjects = [];
    
    // Add toggle for drag-and-drop mode
    const modeToggleContainer = document.createElement('div');
    modeToggleContainer.style.textAlign = 'center';
    modeToggleContainer.style.margin = '20px 0 10px 0';
    const modeToggleLabel = document.createElement('label');
    modeToggleLabel.style.fontWeight = 'bold';
    modeToggleLabel.style.marginRight = '10px';
    modeToggleLabel.textContent = 'Aide-moi (glisser-déposer) : ';
    const modeToggle = document.createElement('input');
    modeToggle.type = 'checkbox';
    modeToggle.id = 'dragdrop-toggle';
    modeToggleLabel.appendChild(modeToggle);
    modeToggleContainer.appendChild(modeToggleLabel);
    verbSelectionArea.parentElement.insertBefore(modeToggleContainer, verbSelectionArea);

    let dragDropMode = false;
    modeToggle.addEventListener('change', function() {
        dragDropMode = modeToggle.checked;
        generateConjugationTablesUI();
    });

    function populateVerbSelection() {
        verbCheckboxList.innerHTML = '';
        verbsArray.forEach((verb, index) => {
            const div = document.createElement('div');
            div.classList.add('verb-select-item');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `verb-${index}`;
            checkbox.value = verb.infinitive;
            const label = document.createElement('label');
            label.htmlFor = `verb-${index}`;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(`${verb.infinitive} (${verb.translation})`));
            div.appendChild(label);
            verbCheckboxList.appendChild(div);
        });
    }
    startPracticeButton.addEventListener('click', () => {
        const checkedBoxes = verbCheckboxList.querySelectorAll('input[type="checkbox"]:checked');
        selectedVerbObjects = [];
        checkedBoxes.forEach(checkbox => {
            const verbData = verbsArray.find(v => v.infinitive === checkbox.value);
            if (verbData) {
                selectedVerbObjects.push(verbData);
            }
        });
        if (selectedVerbObjects.length === 0) {
            alert("Veuillez sélectionner au moins un verbe !");
            return;
        }
        generateConjugationTablesUI();
        verbSelectionArea.classList.add('hidden');
        verbPracticeForms.classList.remove('hidden');
    });
    function generateConjugationTablesUI() {
        conjugationTablesContainer.innerHTML = '';
        selectedVerbObjects.forEach(verb => {
            const verbContainer = document.createElement('div');
            verbContainer.classList.add('verb-practice-instance');
            verbContainer.style.marginBottom = '30px';
            const table = document.createElement('table');
            table.classList.add('conjugation-table');
            table.dataset.infinitive = verb.infinitive;
            const caption = table.createCaption();
            caption.textContent = `${verb.infinitive} (${verb.translation})`;
            table.appendChild(caption);
            const tbody = document.createElement('tbody');
            // For drag-drop mode, collect and shuffle verb forms
            let dragForms = [];
            if (dragDropMode) {
                dragForms = pronouns.map(p => verb.conjugations[p]);
                dragForms = dragForms.sort(() => Math.random() - 0.5);
            }
            pronouns.forEach((pronounKey, idx) => {
                const row = tbody.insertRow();
                const pronounCell = row.insertCell();
                pronounCell.outerHTML = `<th>${pronounDisplayMap[pronounKey]}</th>`;
                const inputCell = row.insertCell();
                if (dragDropMode) {
                    // Drop zone
                    const dropZone = document.createElement('div');
                    dropZone.className = 'drop-zone';
                    dropZone.style.minHeight = '32px';
                    dropZone.style.minWidth = '80px';
                    dropZone.style.border = '2px dashed #50a3a2';
                    dropZone.style.borderRadius = '8px';
                    dropZone.style.display = 'inline-block';
                    dropZone.style.margin = '2px 0';
                    dropZone.style.padding = '2px 8px';
                    dropZone.setAttribute('data-pronoun', pronounKey);
                    dropZone.ondragover = e => { e.preventDefault(); dropZone.style.background = '#eaf7f7'; };
                    dropZone.ondragleave = e => { dropZone.style.background = ''; };
                    dropZone.ondrop = e => {
                        e.preventDefault();
                        dropZone.style.background = '';
                        const draggedId = e.dataTransfer.getData('text/plain');
                        const draggedElem = document.getElementById(draggedId);
                        if (draggedElem) {
                            // Remove any existing child
                            if (dropZone.firstChild) {
                                document.getElementById('drag-choices-' + verb.infinitive).appendChild(dropZone.firstChild);
                            }
                            dropZone.appendChild(draggedElem);
                        }
                    };
                    inputCell.appendChild(dropZone);
                } else {
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.dataset.pronoun = pronounKey;
                    inputField.setAttribute('autocomplete', 'off');
                    inputField.setAttribute('autocorrect', 'off');
                    inputField.setAttribute('autocapitalize', 'none');
                    inputField.setAttribute('spellcheck', 'false');
                    inputCell.appendChild(inputField);
                    const feedbackCell = document.createElement('span');
                    feedbackCell.classList.add('feedback-icon');
                    inputCell.appendChild(feedbackCell);
                }
            });
            table.appendChild(tbody);
            verbContainer.appendChild(table);
            // Drag choices row (only in drag-drop mode)
            if (dragDropMode) {
                const dragChoicesRow = document.createElement('div');
                dragChoicesRow.id = 'drag-choices-' + verb.infinitive;
                dragChoicesRow.style.margin = '10px 0 0 0';
                dragForms.forEach((form, i) => {
                    const dragElem = document.createElement('span');
                    dragElem.className = 'drag-verb-form';
                    dragElem.textContent = form;
                    dragElem.id = `drag-${verb.infinitive}-${i}`;
                    dragElem.setAttribute('draggable', 'true');
                    dragElem.style.display = 'inline-block';
                    dragElem.style.background = '#50a3a2';
                    dragElem.style.color = '#fff';
                    dragElem.style.borderRadius = '12px';
                    dragElem.style.padding = '6px 16px';
                    dragElem.style.margin = '0 8px 8px 0';
                    dragElem.style.fontSize = '1.1em';
                    dragElem.style.cursor = 'grab';
                    dragElem.ondragstart = e => {
                        e.dataTransfer.setData('text/plain', dragElem.id);
                        setTimeout(() => { dragElem.style.opacity = '0.5'; }, 0);
                    };
                    dragElem.ondragend = e => { dragElem.style.opacity = ''; };
                    dragChoicesRow.appendChild(dragElem);
                });
                verbContainer.appendChild(dragChoicesRow);
            }
            // Check button
            const checkVerbButton = document.createElement('button');
            checkVerbButton.classList.add('check-verb-button');
            checkVerbButton.dataset.infinitive = verb.infinitive;
            checkVerbButton.textContent = `Vérifier ${verb.infinitive}`;
            checkVerbButton.style.display = 'block';
            checkVerbButton.style.margin = '10px auto 0 auto';
            verbContainer.appendChild(checkVerbButton);
            conjugationTablesContainer.appendChild(verbContainer);
        });
    }
    conjugationTablesContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('check-verb-button')) {
            const infinitiveToCheck = event.target.dataset.infinitive;
            const verbData = selectedVerbObjects.find(v => v.infinitive === infinitiveToCheck);
            const verbInstance = event.target.closest('.verb-practice-instance');
            const table = verbInstance.querySelector(`.conjugation-table[data-infinitive="${infinitiveToCheck}"]`);
            if (verbData && table) {
                checkSingleVerb(verbData, table, verbInstance);
            }
        }
    });
    function checkSingleVerb(verbData, tableElement, verbInstance) {
        if (dragDropMode) {
            // Drag-drop mode: check drop zones
            pronouns.forEach(pronounKey => {
                const dropZone = verbInstance.querySelector(`.drop-zone[data-pronoun="${pronounKey}"]`);
                if (dropZone) {
                    // Remove previous feedback
                    dropZone.classList.remove('correct', 'incorrect');
                    let feedbackIcon = dropZone.querySelector('.feedback-icon');
                    if (!feedbackIcon) {
                        feedbackIcon = document.createElement('span');
                        feedbackIcon.className = 'feedback-icon';
                        dropZone.appendChild(feedbackIcon);
                    }
                    feedbackIcon.textContent = '';
                    feedbackIcon.classList.remove('correct', 'incorrect');
                    const draggedElem = dropZone.querySelector('.drag-verb-form');
                    const userAnswer = draggedElem ? draggedElem.textContent.trim() : '';
                    const correctAnswer = verbData.conjugations[pronounKey];
                    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                        dropZone.classList.add('correct');
                        feedbackIcon.textContent = '✔';
                        feedbackIcon.classList.add('correct');
                    } else {
                        dropZone.classList.add('incorrect');
                        feedbackIcon.textContent = '✘';
                        feedbackIcon.classList.add('incorrect');
                    }
                }
            });
        } else {
            // ...existing code for text input check...
            pronouns.forEach(pronounKey => {
                const inputField = tableElement.querySelector(`input[data-pronoun="${pronounKey}"]`);
                const feedbackIcon = inputField.nextElementSibling;
                const userAnswer = inputField.value.trim();
                const correctAnswer = verbData.conjugations[pronounKey];
                inputField.classList.remove('correct', 'incorrect');
                feedbackIcon.textContent = '';
                feedbackIcon.classList.remove('correct', 'incorrect');
                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                    inputField.classList.add('correct');
                    feedbackIcon.textContent = '✔';
                    feedbackIcon.classList.add('correct');
                } else {
                    inputField.classList.add('incorrect');
                    feedbackIcon.textContent = '✘';
                    feedbackIcon.classList.add('incorrect');
                }
            });
        }
    }
    if (backToVerbSelectionButtonVT) {
        backToVerbSelectionButtonVT.addEventListener('click', () => {
            verbPracticeForms.classList.add('hidden');
            verbSelectionArea.classList.remove('hidden');
            conjugationTablesContainer.innerHTML = '';
            selectedVerbObjects = [];
        });
    }
    populateVerbSelection();
}

// For backward compatibility: auto-initialize for unit 1 if verbsUnit1 is present
if (typeof verbsUnit1 !== 'undefined' && Array.isArray(verbsUnit1)) {
    document.addEventListener('DOMContentLoaded', function() {
        initVerbTrainerApp(verbsUnit1);
    });
}
