const crypto = require("crypto");

function subject(name, test1, test2, midterm, final, credit) {
  return {
    id: crypto.randomUUID(),
    name,
    test1,
    test2,
    midterm,
    final,
    credit
  };
}

function createSamplePerformance(userId) {
  return {
    userId,
    profile: {
      termName: "Semester 2",
      attendance: 88,
      targetGpa: 8
    },
    subjects: [
      subject("Mathematics", 68, 74, 71, 82, 4),
      subject("Physics", 54, 58, 49, 55, 4),
      subject("Chemistry", 77, 81, 79, 84, 3),
      subject("English", 86, 89, 91, 88, 2),
      subject("Computer Science", 91, 88, 94, 96, 4)
    ],
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  createSamplePerformance
};
