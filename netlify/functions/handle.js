const faqs = require('./faqData');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);
  const cleaned = message.toLowerCase().trim();

  const matched = faqs.find(f => cleaned.includes(f.q));
  if (matched) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: matched.a }),
    };
  }

  const relevantTopics = [
    "parking", "verge", "nature strip", "kerb", "footpath", "carpark", "loading zone",
    "no stopping", "no parking", "clearway", "school zone", "15 minute parking", "2 hour parking",
    "time-restricted parking", "timer expired", "parking limit", "overstayed", "over time limit",
    "parallel parking", "angle parking", "rear to kerb", "wrong direction", "not within bay",
    "wheel on kerb", "vehicle on footpath", "obstructing driveway", "obstructing access",
    "across footpath", "on median", "over yellow line", "over double line", "illegal u-turn",
    "reverse parking", "double parked", "straddling bay", "partially in bay", "occupying two bays",
    "parking across line", "parking in laneway", "in front of fire hydrant", "blocking pedestrian access",
    "on crossover", "driveway blocked", "ranger ticket", "ticket under wiper", "parking fine", "expired ticket",
    "paid parking", "ticket machine", "no ticket displayed", "virtual permit", "visitor permit",
    "resident permit", "parking permit", "disabled bay", "acrod", "acrod bay", "disability parking",
    "disabled parking", "accessible bay", "disabled permit", "acrod permit", "acrod sticker",
    "acrod pass", "acrod holder", "acrod zone", "parking for disabled", "disability access",
    "animal", "dog", "dogs", "puppy", "puppies", "cat", "cats", "kitten", "pets", "barking", "bite", "attacked",
    "attack", "muzzle", "dangerous dog", "restricted breed", "leash", "off leash", "dog park",
    "microchip", "microchipped", "registration", "impounded", "lost dog", "wandering dog", "dog poo",
    "poop", "pick up after", "stray", "wildlife", "animal complaint", "dog warden", "animal noise",
    "bin", "bins", "rubbish", "garbage", "waste", "green waste", "red bin", "yellow bin",
    "illegal dumping", "litter", "bulk verge", "bin left out", "bin not collected", "overflowing bin",
    "public bin", "waste disposal", "skip bin", "bin on road", "cleanup",
    "noise", "nuisance", "party", "loud music", "antisocial", "hooning", "car revving", "yelling",
    "public disturbance", "vandalism", "urinating", "fighting", "public nuisance", "fire", "bushfire",
    "burning", "fire pit", "chiminea", "smoke", "fire hazard", "firebreak", "backyard burning",
    "open flame", "campfire", "bbq smoke", "hazard", "danger", "event", "amplified music", "markets",
    "stalls", "banner", "poster", "signage", "busking", "skateboard", "bicycle", "e-scooter", "scooter",
    "crowd", "amusement", "temporary fencing", "jumping castle", "inflatable", "event permit",
    "building site", "contractor", "builder", "materials on verge", "construction zone", "tradesman",
    "dust", "fencing", "work zone", "equipment left on road", "portable toilet", "scaffold", "crane",
    "blocking driveway", "cement truck", "trailer on verge", "homeless", "rough sleeper", "tent",
    "sleeping in car", "swag", "welfare check", "blanket", "squat", "outreach", "ruah", "support services",
    "shelter", "accommodation", "report", "complaint", "submit complaint", "lodge a report",
    "application", "permit request", "notice", "warning", "final notice", "ranger visit", "body cam",
    "evidence", "investigation", "follow up", "compliance officer", "ranger patrol", "ranger hours",
    "ranger number", "abandoned car", "unregistered", "flat tyres", "car left", "rusted car",
    "boat trailer", "vehicle left on road", "truck parked", "commercial vehicle", "ute", "illegally parked car",
    "off-road", "quad bike", "motorbike", "graffiti", "fence damage", "sign broken", "stormwater",
    "footpath damage", "verge tree", "streetlight", "pothole", "trip hazard", "illegal sign", "shed", "gate",
    "driveway crossover", "retaining wall", "encroachment", "verge garden", "verge treatment"
  ];

  const isRelevant = relevantTopics.some(topic => cleaned.includes(topic));
  if (!isRelevant) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "I'm here to help with local laws, parking, pets, safety, or ranger services. Try asking about those." })
    };
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: completion.data.choices[0].message.content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sorry, I'm having trouble answering right now." }),
    };
  }
};
