// Adjectives activity (unit 6) logic
const adjSentences = [
    { s: "Léo a un ... vélo ... .", forms: ["super"], answers: ["super", ""] },
    { s: "Marie a une ... idée ... pour le cadeau.", forms: ["autre", "autre", "autres", "autres"], answers: ["autre", ""] },
    { s: "C'est une ...  histoire ... !", forms: ["fantastique", "fantastique", "fantastiques", "fantastiques"], answers: ["", "fantastique"] },
    { s: "C'est un ... ami ... .", forms: ["faux", "fausse", "faux", "fausses"], answers: ["faux", ""] },
    { s: "J'ai vu un ...  animal ...  dans le parc.", forms: ["bizarre", "bizarre", "bizarres", "bizarres"], answers: ["", "bizarre"] },
    { s: "J'écoute une ...  chanson ... .", forms: ["français", "française", "français", "françaises"], answers: ["", "française"] },
    { s: "C'est un ...  garçon ... .", forms: ["sympa"], answers: ["sympa", ""] },
    { s: "J'aime la ...  musique ... .", forms: ["classique", "classique", "classiques", "classiques"], answers: ["", "classique"] },
    { s: "Mon ami a une  ... voiture ... .", forms: ["allemand", "allemande", "allemands", "allemandes"], answers: ["", "allemande"] },
    { s: "C'est un ...  livre ... .", forms: ["intéressant", "intéressante", "intéressants", "intéressantes"], answers: ["intéressant", ""] },
    { s: "Marie est une  ... fille ... aujourd'hui.", forms: ["content", "contente", "contents", "contentes"], answers: ["", "contente"] },
    { s: "C'est une ... idée ... .", forms: ["mauvais", "mauvaise", "mauvais", "mauvaises"], answers: ["mauvaise", ""] },
    { s: "J'ai mangé un  ... gâteau ... .", forms: ["bon", "bonne", "bons", "bonnes"], answers: ["bon", ""] },
    { s: "Regarde le ... chat ... !", forms: ["petit", "petite", "petits", "petites"], answers: ["petit", ""] },
    { s: "C'est une  ... chanson ... .", forms: ["triste", "triste", "tristes", "tristes"], answers: ["", "triste"] },
    { s: "Ce ...  jeu ...  n'est pas amusant.", forms: ["nul", "nulle", "nuls", "nulles"], answers: ["", "nul"] },
    { s: "Il a un ... chien ... dans le jardin.", forms: ["grand", "grande", "grands", "grandes"], answers: ["grand", ""] },
    { s: "J'ai une ... casquette ... .", forms: ["rouge", "rouge", "rouges", "rouges"], answers: ["", "rouge"] },
    { s: "Le ...  cahier ... est sur la table.", forms: ["vert", "verte", "verts", "vertes"], answers: ["", "vert"] },
    { s: "Elle a une ...  voiture ... .", forms: ["bleu", "bleue", "bleus", "bleues"], answers: ["", "bleue"] },
    { s: "C'est une  ... maison ... .", forms: ["joli", "jolie", "jolis", "jolies"], answers: ["jolie", ""] },
    { s: "J'ai un ...  chien ... .", forms: ["blanc", "blanche", "blancs", "blanches"], answers: ["", "blanc"] },
    { s: "Mon ...  stylo ...  ne marche plus.", forms: ["noir", "noire", "noirs", "noires"], answers: ["", "noir"] },
    { s: "J'ai un ...  chat ... .", forms: ["gris", "grise", "gris", "grises"], answers: ["", "gris"] },
    { s: "Elle a un ...  sac ... .", forms: ["jaune", "jaune", "jaunes", "jaunes"], answers: ["", "jaune"] },
    { s: "C'est ma ...  chanson ... .", forms: ["préféré", "préférée", "préférés", "préférées"], answers: ["", "préférée"] },
    { s: "Mon  ... ami ... arrive demain.", forms: ["cher", "chère", "chers", "chères"], answers: ["cher", ""] },
    { s: "C'est un  ... quartier ... .", forms: ["moderne", "moderne", "modernes", "modernes"], answers: ["", "moderne"] },
    { s: "C'est un  ... chanteur ... .", forms: ["célèbre", "célèbre", "célèbres", "célèbres"], answers: ["", "célèbre"] },
    { s: "C'est une  ... idée ...  !", forms: ["génial", "géniale", "géniaux", "géniales"], answers: ["", "géniale"] },
    { s: "J'ai vu une  ... maman ...  au parc.", forms: ["désolé", "désolée", "désolés", "désolées"], answers: ["", "désolée"] },
    { s: "Le ...  élève ... dort en classe.", forms: ["fatigué", "fatiguée", "fatigués", "fatiguées"], answers: ["", "fatigué"] },
    { s: "C'est une  ... voiture ... .", forms: ["écologique", "écologique", "écologiques", "écologiques"], answers: ["", "écologique"] },
    { s: "Léo a des  ... idées ... .", forms: ["cool"], answers: ["cool", ""] },
    { s: "Ce n'est pas une ... note ... dans la chanson.", forms: ["faux", "fausse", "faux", "fausses"], answers: ["fausse", ""] },
    { s: "Il y a des ...  bruits ...  dans la maison la nuit.", forms: ["bizarre", "bizarre", "bizarres", "bizarres"], answers: ["", "bizarres"] },
    { s: "Mes ...  copains ...  viennent à ma fête.", forms: ["sympa"], answers: ["sympa", ""] },
    { s: "C'est une ...  journée ...  pour aller au parc, il pleut.", forms: ["nul", "nulle", "nuls", "nulles"], answers: ["", "nulle"] },
    { s: "Quel est ton ...  sport ... ?", forms: ["préféré", "préférée", "préférés", "préférées"], answers: ["", "préféré"] },
    { s: "J'écris une lettre à ma  ... grand-mère ... .", forms: ["cher", "chère", "chers", "chères"], answers: ["chère", ""] },
    { s: "Nous allons passer des  ... vacances ...  en France.", forms: ["génial", "géniale", "géniaux", "géniales"], answers: ["", "géniales"] },
    { s: "Prendre le vélo est un  ... moyen de transport ... .", forms: ["écologique", "écologique", "écologiques", "écologiques"], answers: ["", "écologique"] }
];
const chunkSize = 5;
let currentChunk = 0;
function renderChunk() {
    const container = document.getElementById('adj-app-container');
    container.innerHTML = '';
    const start = currentChunk * chunkSize;
    const end = Math.min(start + chunkSize, adjSentences.length);
    const chunk = adjSentences.slice(start, end);
    // Progress bar
    const percent = Math.floor((currentChunk * chunkSize / adjSentences.length) * 100);
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar-wrap';
    progressBar.innerHTML = `
        <div class="progress-label">Progression : ${Math.min(currentChunk * chunkSize, adjSentences.length)} / ${adjSentences.length}</div>
        <div class="progress-bar-bg">
            <div class="progress-bar-inner" id="progress-inner" style="width:${percent}%"></div>
        </div>
    `;
    container.appendChild(progressBar);
    // Sentences
    chunk.forEach((item, idx) => {
        let html = item.s;
        let gapCount = (html.match(/\.\.\./g) || []).length;
        let gapIdx = 0;
        html = html.replace(/\.\.\./g, () => `<span class='adj-gap'><select class='adj-select' data-gap='${gapIdx++}'><option value=''></option>${item.forms.map(f => `<option value='${f}'>${f}</option>`).join('')}</select></span>`);
        const div = document.createElement('div');
        div.className = 'adj-sentence';
        div.innerHTML = html;
        container.appendChild(div);
    });
    // Controls
    const controls = document.createElement('div');
    controls.className = 'adj-controls';
    const checkBtn = document.createElement('button');
    checkBtn.textContent = 'Vérifier';
    checkBtn.onclick = () => checkAnswers(chunk);
    controls.appendChild(checkBtn);
    if (end < adjSentences.length) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Suivant';
        nextBtn.disabled = true;
        nextBtn.id = 'next-chunk-btn';
        controls.appendChild(nextBtn);
    }
    container.appendChild(controls);
    // Feedback
    const feedback = document.createElement('div');
    feedback.className = 'adj-feedback';
    feedback.id = 'adj-feedback';
    container.appendChild(feedback);
}
function checkAnswers(chunk) {
    const container = document.getElementById('adj-app-container');
    const sentences = container.querySelectorAll('.adj-sentence');
    let allCorrect = true;
    sentences.forEach((div, idx) => {
        const selects = div.querySelectorAll('select.adj-select');
        selects.forEach((sel, gapIdx) => {
            const user = sel.value;
            const correct = chunk[idx].answers[gapIdx];
            sel.classList.remove('correct', 'incorrect');
            if (user === correct) {
                sel.classList.add('correct');
            } else {
                sel.classList.add('incorrect');
                allCorrect = false;
            }
        });
    });
    const feedback = document.getElementById('adj-feedback');
    if (allCorrect) {
        feedback.textContent = 'Bravo ! Toutes les réponses sont correctes.';
        // Fill progress bar to next chunk
        const progressInner = document.getElementById('progress-inner');
        const nextPercent = Math.floor(((currentChunk + 1) * chunkSize / adjSentences.length) * 100);
        progressInner.style.width = `${nextPercent}%`;
        // Update label
        const progressLabel = progressInner.parentElement.previousElementSibling;
        progressLabel.textContent = `Progression : ${Math.min((currentChunk + 1) * chunkSize, adjSentences.length)} / ${adjSentences.length}`;
        // Enable next button if exists
        const nextBtn = document.getElementById('next-chunk-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.onclick = () => {
                currentChunk++;
                renderChunk();
            };
        }
    } else {
        feedback.textContent = 'Corrige les réponses incorrectes puis réessaie.';
    }
}
document.addEventListener('DOMContentLoaded', renderChunk);
