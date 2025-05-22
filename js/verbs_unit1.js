// js/verbs_unit1.js
const verbsUnit1 = [
    {
        infinitive: "être",
        translation: "sein (to be)", // German translation for the infinitive
        conjugations: {
            je: "suis",
            tu: "es",
            il_elle_on: "est",
            nous: "sommes",
            vous: "êtes",
            ils_elles: "sont"
        }
    },
    {
        infinitive: "avoir",
        translation: "haben (to have)",
        conjugations: {
            je: "ai",
            tu: "as",
            il_elle_on: "a",
            nous: "avons",
            vous: "avez",
            ils_elles: "ont"
        }
    },
    {
        infinitive: "s'appeler", // Example of a reflexive verb
        translation: "heißen (to be called)",
        conjugations: {
            je: "m'appelle",
            tu: "t'appelles",
            il_elle_on: "s'appelle",
            nous: "nous appelons",
            vous: "vous appelez",
            ils_elles: "s'appellent"
        }
    },
    {
        infinitive: "aller",
        translation: "gehen (to go)",
        conjugations: {
            je: "vais",
            tu: "vas",
            il_elle_on: "va",
            nous: "allons",
            vous: "allez",
            ils_elles: "vont"
        }
    }
    // TODO: Add more verbs relevant to Unit 1 from your son's book.
    // For example: faire, venir, pouvoir, vouloir, dire, prendre etc.
    // Ensure conjugations are accurate for present tense (or whichever tense you're focusing on).
];

// Helper function (optional, if you want to get verbs by unit from a larger file later)
function getVerbsForUnit(unitId) {
    if (unitId === 'unit1') { // Simple mapping for now
        return verbsUnit1;
    }
    return [];
}
