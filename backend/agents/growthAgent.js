const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateMatchExplanation = async (project, artist) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are TuneLink AI.

Project: ${project.title}
Genre: ${project.genre}
Language: ${project.language}
Required Roles: ${project.requiredRoles.join(", ")}

Artist: ${artist.stageName}
Genres: ${artist.genres.join(", ")}
Languages: ${artist.languages.join(", ")}
Skills: ${artist.skills.join(", ")}

Give:
1. Why this artist is a good match
2. A short message to send them
3. One fun collaboration idea
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("Gemini failed:", error.message);

    return `${artist.stageName} is a good match because their profile matches your project needs. They work in ${artist.genres.join(
      ", "
    )}, know ${artist.languages.join(
      ", "
    )}, and have skills like ${artist.skills.join(
      ", "
    )}. You can send them a collab request for "${project.title}".`;
  }
};

module.exports = { generateMatchExplanation };