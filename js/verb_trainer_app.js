// js/verb_trainer_app.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof verbsUnit1 === 'undefined' || verbsUnit1.length === 0) {
        const verbSelectionArea = document.getElementById('verb-selection-area');
        if (verbSelectionArea) verbSelectionArea.innerHTML = '<p>Aucun verbe à charger pour cette unité. Veuillez vérifier le fichier <code>js/verbs_unit1.js</code>.</p>';
        return;
    }

    const verbCheckboxList = document.getElementById('verb-checkbox-list');
    const startPracticeButton = document.getElementById('start-practice-button');
    const verbSelectionArea = document.getElementById('verb-selection-area');
    const verbPracticeForms = document.getElementById('verb-practice-forms');
    const conjugationTablesContainer = document.getElementById('conjugation-tables-container');
    // const checkAnswersButton = document.getElementById('check-answers-button'); // Global button - now removed or handled differently
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

    function populateVerbSelection() {
        verbCheckboxList.innerHTML = '';
        verbsUnit1.forEach((verb, index) => {
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
            const verbData = verbsUnit1.find(v => v.infinitive === checkbox.value);
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
            const verbContainer = document.createElement('div'); // Container for table + its button
            verbContainer.classList.add('verb-practice-instance');
            verbContainer.style.marginBottom = '30px'; // Add some space between verbs

            const table = document.createElement('table');
            table.classList.add('conjugation-table');
            table.dataset.infinitive = verb.infinitive;

            const caption = table.createCaption();
            caption.textContent = `${verb.infinitive} (${verb.translation})`;
            table.appendChild(caption);

            const tbody = document.createElement('tbody');
            pronouns.forEach(pronounKey => {
                const row = tbody.insertRow();
                const pronounCell = row.insertCell();
                pronounCell.outerHTML = `<th>${pronounDisplayMap[pronounKey]}</th>`;

                const inputCell = row.insertCell();
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
            });
            table.appendChild(tbody);
            verbContainer.appendChild(table); // Add table to its container

            // Create a "Check" button for this specific verb
            const checkVerbButton = document.createElement('button');
            checkVerbButton.classList.add('check-verb-button');
            checkVerbButton.dataset.infinitive = verb.infinitive; // Link button to its verb
            checkVerbButton.textContent = `Vérifier ${verb.infinitive}`;
            checkVerbButton.style.display = 'block';
            checkVerbButton.style.margin = '10px auto 0 auto'; // Center it below its table
            verbContainer.appendChild(checkVerbButton); // Add button to its container

            conjugationTablesContainer.appendChild(verbContainer); // Add the whole verb instance to the main container
        });
    }

    // Event delegation for per-verb check buttons
    conjugationTablesContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('check-verb-button')) {
            const infinitiveToCheck = event.target.dataset.infinitive;
            const verbData = selectedVerbObjects.find(v => v.infinitive === infinitiveToCheck);
            const table = event.target.closest('.verb-practice-instance').querySelector(`.conjugation-table[data-infinitive="${infinitiveToCheck}"]`);

            if (verbData && table) {
                checkSingleVerb(verbData, table);
            }
        }
    });

    // Function to check answers for a single verb table
    function checkSingleVerb(verbData, tableElement) {
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

    if (backToVerbSelectionButtonVT) {
        backToVerbSelectionButtonVT.addEventListener('click', () => {
            verbPracticeForms.classList.add('hidden');
            verbSelectionArea.classList.remove('hidden');
            conjugationTablesContainer.innerHTML = '';
            selectedVerbObjects = [];
        });
    }

    populateVerbSelection();
});
