const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load backend environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const ArtistProfile = require("./models/ArtistProfile");
const Project = require("./models/Project");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tunelink";
    console.log("Connecting to MongoDB at:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully. Clearing database...");

    // Clear existing data
    await User.deleteMany({});
    await ArtistProfile.deleteMany({});
    await Project.deleteMany({});
    console.log("Database cleared.");

    // Hash default password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Users
    console.log("Creating users...");
    const users = await User.insertMany([
      {
        name: "Rohan Beats",
        email: "rohan@tunelink.com",
        password: hashedPassword,
        role: "Producer",
        plan: "Pro Artist"
      },
      {
        name: "Sarah Vibe",
        email: "sarah@tunelink.com",
        password: hashedPassword,
        role: "Singer",
        plan: "Pro Artist"
      },
      {
        name: "Aarav Strings",
        email: "aarav@tunelink.com",
        password: hashedPassword,
        role: "Guitarist",
        plan: "Free"
      },
      {
        name: "Aisha Lyrics",
        email: "aisha@tunelink.com",
        password: hashedPassword,
        role: "Lyricist",
        plan: "Free"
      },
      {
        name: "Kabir Mix",
        email: "kabir@tunelink.com",
        password: hashedPassword,
        role: "Mix Engineer",
        plan: "Band Plan"
      }
    ]);
    console.log(`Created ${users.length} users.`);

    // Find User IDs
    const rohan = users.find(u => u.name === "Rohan Beats");
    const sarah = users.find(u => u.name === "Sarah Vibe");
    const aarav = users.find(u => u.name === "Aarav Strings");
    const aisha = users.find(u => u.name === "Aisha Lyrics");
    const kabir = users.find(u => u.name === "Kabir Mix");

    // Create Artist Profiles
    console.log("Creating artist profiles...");
    const profiles = await ArtistProfile.insertMany([
      {
        user: rohan._id,
        stageName: "Rohan Beats",
        bio: "Electronic music producer. Specializes in Synthwave, Lo-Fi, and Hip Hop beats. I create spacey synths, driving basslines, and boom-bap rhythms for vocalists worldwide.",
        genres: ["Synthwave", "Lo-Fi", "Hip Hop"],
        languages: ["English", "Hindi"],
        skills: ["Ableton Live", "Analog Synths", "Drum Programming", "Sampling"],
        location: "Mumbai, India",
        experienceLevel: "Headliner",
        demoLink: "http://sound.com/rohan-beats-demo",
        equipment: "Ableton Push 2, Moog Sub 37, Focusrite 18i20, Yamaha HS8 Monitors.",
        collaborationStatus: "Open to Collab",
        badges: ["Verified"],
        rating: 4.9
      },
      {
        user: sarah._id,
        stageName: "Sarah Vibe",
        bio: "Acoustic pop and indie vocalist & songwriter. Love writing layered harmonies, airy choruses, and intimate lyrics. Let's make musical magic together!",
        genres: ["Indie Folk", "Acoustic Pop", "R&B"],
        languages: ["English"],
        skills: ["Lead Vocals", "Harmonies", "Songwriting", "Ukulele"],
        location: "Bangalore, India",
        experienceLevel: "Rising Voice",
        demoLink: "http://sound.com/sarah-vibe-vocals",
        equipment: "Neumann TLM 103 Condenser Microphone, Focusrite Scarlett Solo, Logic Pro X.",
        collaborationStatus: "Open to Collab",
        badges: ["Verified"],
        rating: 4.8
      },
      {
        user: aarav._id,
        stageName: "Aarav Strings",
        bio: "Acoustic guitarist focusing on lush fingerpicking arrangements, classical styling, and emotive lead acoustic sections for indie, folk, and cinematic projects.",
        genres: ["Indie Acoustic", "Classical", "Folk"],
        languages: ["Hindi", "English"],
        skills: ["Acoustic Guitar", "Classical Guitar", "Fingerpicking", "Arranging"],
        location: "Delhi, India",
        experienceLevel: "Hidden Gem",
        demoLink: "http://sound.com/aarav-acoustic",
        equipment: "Taylor 114ce Acoustic Guitar, Shure SM81 Mic, Pro Tools.",
        collaborationStatus: "Open to Collab",
        badges: [],
        rating: 4.5
      },
      {
        user: aisha._id,
        stageName: "Aisha Written",
        bio: "Poetic lyricist writing deep, storytelling verses about life, love, and modern isolation. Looking to collaborate with acoustic guitarists and indie producers.",
        genres: ["Indie Folk", "Pop", "Alternative Rock"],
        languages: ["English", "Urdu"],
        skills: ["Lyric Writing", "Storytelling", "Poetry", "Topline Writing"],
        location: "Online",
        experienceLevel: "Bedroom Artist",
        demoLink: "http://sound.com/aisha-poetry",
        equipment: "Pen and Notebook, iPad Pro, Focusrite Scarlett Solo.",
        collaborationStatus: "Open to Collab",
        badges: [],
        rating: 4.2
      },
      {
        user: kabir._id,
        stageName: "Kabir Audio",
        bio: "Professional mixing and mastering engineer with a passion for bringing out clarity, punch, and depth in remote indie projects.",
        genres: ["Alternative Rock", "Pop", "Hip Hop"],
        languages: ["English", "Hindi"],
        skills: ["Mixing", "Mastering", "Vocal Tuning", "Analog Summing"],
        location: "Pune, India",
        experienceLevel: "Headliner",
        demoLink: "http://sound.com/kabir-mixes",
        equipment: "Pro Tools Ultimate, Universal Audio Apollo x8, SSL G-Comp hardware, Focal Trio6 Be.",
        collaborationStatus: "Open to Collab",
        badges: ["Verified"],
        rating: 5.0
      }
    ]);
    console.log(`Created ${profiles.length} artist profiles.`);

    // Create Projects
    console.log("Creating collaboration board projects...");
    const projects = await Project.insertMany([
      {
        owner: rohan._id,
        title: "Midnight Drive",
        contentType: "Original",
        genre: "Synthwave",
        language: "English",
        publicDescription: "Instrumental synthwave track with a retro-futuristic driving beat. Seeking an airy female vocalist to write and sing a catchy chorus and verse.",
        lyricsPreview: "Cruising down the neon street, under digital skies...",
        protectedLyrics: "Cruising down the neon street, under digital skies, waiting for our paths to meet, running from the lies...",
        requiredRoles: ["Singer", "Lyricist"],
        status: "Open",
        collaborators: []
      },
      {
        owner: aarav._id,
        title: "Lost in Monsoon",
        contentType: "Original",
        genre: "Folk",
        language: "Hindi",
        publicDescription: "A melancholy acoustic folk composition in C# minor, recorded with high-end microphones. Needs soft, emotive vocals to complete the rainy afternoon vibe.",
        lyricsPreview: "Baarishein aayi hai fir se yaadein lekar...",
        protectedLyrics: "Baarishein aayi hai fir se yaadein lekar, tum kyun nahi aaye is baar...",
        requiredRoles: ["Singer"],
        status: "In Progress",
        collaborators: [sarah._id]
      },
      {
        owner: rohan._id,
        title: "Neon Horizons",
        contentType: "Original",
        genre: "Synthwave",
        language: "English",
        publicDescription: "Upbeat cyberpunk instrumental. Looking for an electric guitarist to play a blazing 80s-style guitar solo in the outro.",
        lyricsPreview: "[Instrumental Outro Solo Section]",
        protectedLyrics: "[Instrumental Outro Solo Section]",
        requiredRoles: ["Guitarist"],
        status: "Open",
        collaborators: []
      },
      {
        owner: sarah._id,
        title: "Summer Rain",
        contentType: "Original",
        genre: "Pop",
        language: "English",
        publicDescription: "A happy acoustic pop demo recorded with ukulele. Looking for a producer to build a tropical house beat around it for a summer release.",
        lyricsPreview: "Sunlight through the raindrops, walking on the street...",
        protectedLyrics: "Sunlight through the raindrops, walking on the street, feel it in my heart now, tapping with my feet...",
        requiredRoles: ["Producer"],
        status: "Open",
        collaborators: []
      },
      {
        owner: kabir._id,
        title: "Shadows of Today",
        contentType: "Original",
        genre: "Rock",
        language: "English",
        publicDescription: "Heavy indie rock track in drop D. Needs a lyricist to co-write lyrics and an energetic rhythm guitarist.",
        lyricsPreview: "Cold steel shadows on the pavement, counting down the hours...",
        protectedLyrics: "Cold steel shadows on the pavement, counting down the hours, searching for what this engagement gave to us, the dying flowers...",
        requiredRoles: ["Lyricist", "Guitarist"],
        status: "Open",
        collaborators: []
      }
    ]);
    console.log(`Created ${projects.length} project openings.`);

    console.log("Database seeded successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedData();
