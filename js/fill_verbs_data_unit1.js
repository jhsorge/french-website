// js/fill_verbs_data_unit1.js
const sentenceFillDataUnit1 = [
    {
        id: 1,
        segments: [
            { type: "text", content: "Je " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "suis", placeholder: "..." },
            { type: "text", content: " Chloe et je " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "suis", placeholder: "....." },
            { type: "text", content: " de Monaco." }
        ]
    },
    {
        id: 2,
        segments: [
            { type: "text", content: "Tu " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "es", placeholder: ".." },
            { type: "text", content: " super!" }
        ]
    },
    {
        id: 3,
        segments: [
            { type: "text", content: "Et toi? Tu " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "es", placeholder: ".." },
            { type: "text", content: " de Paris, aussi?" }
        ]
    },
    {
        id: 4,
        segments: [
            { type: "text", content: "Nadine " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "est", placeholder: ".." },
            { type: "text", content: " fantastique. Elle " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "est", placeholder: ".." },
            { type: "text", content: " une copine de Valentin." }
        ]
    },
    {
        id: 5,
        segments: [
            { type: "text", content: "Salut! Tu " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "es", placeholder: ".." },
            { type: "text", content: " de Brest? - Non, je " },
            { type: "dropdown", options: ["suis", "es", "est"], correctAnswer: "suis", placeholder: ".." },
            { type: "text", content: " de Paris." }
        ]
    }
];

// Helper function (optional, if you plan to have more sets or units)
function getSentenceFillData(unitId, setId) {
    if (unitId === 'unit1' && setId === 1) { // Assuming this is set 1 for unit 1
        return sentenceFillDataUnit1;
    }
    return [];
}
