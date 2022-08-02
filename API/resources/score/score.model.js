const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    studentid: String,
    grade: Number,
    semester: Number,
    subject: String,
    assignment: Number,
    quiz: Number,
    project: Number,
    mid: Number,
    final: Number
 /*   grade10: {
        semester1: {
            english: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            afanoromo: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            amharic: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            chemistry: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            biology: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            physics: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            social: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            civics: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            hpe: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            ict: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
        },
        semester2: {
            english: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            afanoromo: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            amharic: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            chemistry: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            biology: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            physics: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            social: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            civics: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            hpe: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
            ict: {
                assignment: Number,
                quiz: Number,
                project: Number,
                mid: Number,
                final: Number,
            },
        }
    }*/
            
})

const Score = mongoose.model('score', scoreSchema)

module.exports = Score