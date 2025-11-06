export default function useCanAnswer(question, answers){
    const normalized = question.toLowerCase().trim();
    const match = answers.find(r =>
        r.input.some(i => normalized ===i || normalized.startsWith(i + "") || normalized.endsWith(" " + i) || normalized.includes(" " + i + " "))
    );

    if (match){
        if (Array.isArray(match.reply)) return {match:true, reply:match.reply[Math.floor(Math.random() * match.reply.length)]}
        return {match:true, reply:match.reply}
    }

    return {match:false};
}