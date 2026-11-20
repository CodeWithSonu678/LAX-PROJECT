const Memory = require("../models/Memory");

// ========================================
// CONSTANTS
// ========================================

const ALLOWED_TYPES = [
  "personal_fact",
  "preference",
  "project_fact",
  "learning_context",
  "conversation_summary",
  "other",
];

const ALLOWED_SOURCES = ["user", "assistant", "external"];

// ========================================
// NORMALIZE TEXT
// ========================================

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}+#.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(value = "") {
  return new Set(
    normalizeText(value)
      .split(" ")
      .filter((word) => word.length >= 2)
  );
}

function similarity(a, b) {
  const first = tokenize(a);
  const second = tokenize(b);

  if (!first.size || !second.size) return 0;

  let intersection = 0;

  for (const word of first) {
    if (second.has(word)) intersection++;
  }

  return intersection / (first.size + second.size - intersection);
}

// ========================================
// TOPIC KEYWORDS
// ========================================

const TOPIC_GROUPS = {
  cpp_constructor: [
    "c++",
    "cpp",
    "constructor",
    "default constructor",
    "parameterized constructor",
    "copy constructor",
  ],

  java_inheritance: [
    "java",
    "inheritance",
    "extends",
    "parent class",
    "child class",
    "superclass",
    "subclass",
  ],

  personal_project: [
    "my project",
    "my company",
    "my business",
    "organization",
    "what do i do",
    "mera project",
    "main kya chalata",
    "meri company",
  ],
};

function detectGroups(text) {
  const normalized = normalizeText(text);
  const groups = new Set();

  for (const [group, terms] of Object.entries(TOPIC_GROUPS)) {
    if (
      terms.some((term) =>
        normalized.includes(normalizeText(term))
      )
    ) {
      groups.add(group);
    }
  }

  return groups;
}

// ========================================
// 1. SAVE OR UPDATE MEMORY
// ========================================

async function saveMemory({
  userId,
  type = "other",
  key,
  value,
  topic,
  entities = [],
  source = "user",
  confidence = 1,
  conversationId = null,
}) {
  if (
    !userId ||
    typeof key !== "string" ||
    !key.trim() ||
    typeof value !== "string" ||
    !value.trim() ||
    typeof topic !== "string" ||
    !topic.trim()
  ) {
    throw new Error(
      "userId, key, value and topic are required."
    );
  }

  if (!ALLOWED_TYPES.includes(type)) {
    throw new Error("Invalid memory type.");
  }

  if (!ALLOWED_SOURCES.includes(source)) {
    throw new Error("Invalid memory source.");
  }

  if (
    typeof confidence !== "number" ||
    confidence < 0 ||
    confidence > 1
  ) {
    throw new Error("Confidence must be between 0 and 1.");
  }

  const normalizedKey = normalizeText(key);

  const normalizedEntities = [
    ...new Set(
      entities
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ].slice(0, 20);

  // Exact-key duplicate: update instead of inserting.
  const existingMemory = await Memory.findOne({
    userId,
    key: normalizedKey,
    isActive: true,
  });

  if (existingMemory) {
    existingMemory.type = type;
    existingMemory.value = value.trim();
    existingMemory.topic = topic.trim();
    existingMemory.entities = normalizedEntities;
    existingMemory.source = source;
    existingMemory.confidence = confidence;
    existingMemory.conversationId = conversationId;

    await existingMemory.save();

    return {
      action: "updated",
      memory: existingMemory,
    };
  }

  // Similar knowledge detection for assistant-generated facts.
  // Do not merge personal facts or project facts just because
  // their wording looks similar.
  if (source === "assistant" && type === "learning_context") {
    const existingKnowledge = await Memory.find({
      userId,
      isActive: true,
      source: "assistant",
      type: "learning_context",
    })
      .select("_id key value topic")
      .limit(200)
      .lean();

    const duplicate = existingKnowledge.find((memory) => {
      const sameTopic =
        similarity(memory.topic, topic) >= 0.5;

      const sameMeaning =
        similarity(memory.value, value) >= 0.72;

      const sameKey =
        similarity(memory.key, normalizedKey) >= 0.65;

      return sameTopic && (sameMeaning || sameKey);
    });

    if (duplicate) {
      const existing = await Memory.findById(duplicate._id);

      if (existing) {
        // Keep the existing key; refresh its knowledge.
        existing.value = value.trim();
        existing.topic = topic.trim();

        existing.entities = [
          ...new Set([
            ...(existing.entities || []),
            ...normalizedEntities,
          ]),
        ].slice(0, 20);

        existing.confidence = Math.max(
          existing.confidence || 0,
          confidence
        );

        existing.conversationId = conversationId;

        await existing.save();

        return {
          action: "deduplicated",
          memory: existing,
        };
      }
    }
  }

  const memory = await Memory.create({
    userId,
    type,
    key: normalizedKey,
    value: value.trim(),
    topic: topic.trim(),
    entities: normalizedEntities,
    source,
    confidence,
    conversationId,
    isActive: true,
  });

  return {
    action: "created",
    memory,
  };
}

// ========================================
// 2. RETRIEVE RELEVANT MEMORIES
// ========================================

async function retrieveRelevantMemories({
  userId,
  query,
  topic,
  entities = [],
  limit = 5,
}) {
  if (!userId || !query) {
    throw new Error("userId and query are required.");
  }

  const safeLimit = Math.min(
    Math.max(Number(limit) || 5, 1),
    10
  );

  const normalizedQuery = normalizeText(query);
  const normalizedTopic = normalizeText(topic || "");

  const queryGroups = detectGroups(
    `${normalizedQuery} ${normalizedTopic} ${entities.join(" ")}`
  );

  // Extract useful words from query and topic.
  const terms = new Set([
    ...tokenize(normalizedQuery),
    ...tokenize(normalizedTopic),
  ]);

  for (const entity of entities) {
    for (const word of tokenize(entity)) {
      terms.add(word);
    }
  }

  // Add related keywords only for the identified topic.
  if (queryGroups.has("cpp_constructor")) {
    for (const term of TOPIC_GROUPS.cpp_constructor) {
      terms.add(normalizeText(term));
    }
  }

  if (queryGroups.has("java_inheritance")) {
    for (const term of TOPIC_GROUPS.java_inheritance) {
      terms.add(normalizeText(term));
    }
  }

  const regexes = [...terms]
    .filter((term) => term.length >= 2)
    .slice(0, 30)
    .map((term) => new RegExp(escapeRegex(term), "i"));

  if (!regexes.length) return [];

  const candidates = await Memory.find({
    userId,
    isActive: true,
    $or: [
      { key: { $in: regexes } },
      { value: { $in: regexes } },
      { topic: { $in: regexes } },
      { entities: { $in: regexes } },
    ],
  })
    .sort({ confidence: -1, updatedAt: -1 })
    .limit(100)
    .lean();

  // Score candidates instead of returning the first keyword matches.
  const scored = candidates.map((memory) => {
    const searchableText = normalizeText(
      `${memory.key} ${memory.topic} ${memory.value} ${(memory.entities || []).join(" ")}`
    );

    let score = 0;

    if (
      normalizedTopic &&
      normalizeText(memory.topic) === normalizedTopic
    ) {
      score += 8;
    } else if (
      normalizedTopic &&
      similarity(memory.topic, normalizedTopic) >= 0.4
    ) {
      score += 4;
    }

    if (normalizeText(memory.key) === normalizedQuery) {
      score += 8;
    }

    for (const term of terms) {
      if (term.length >= 3 && searchableText.includes(term)) {
        score += 1;
      }
    }

    const memoryGroups = detectGroups(
      `${memory.topic} ${memory.key} ${memory.value} ${(memory.entities || []).join(" ")}`
    );

    // Penalize unrelated topic groups.
    if (queryGroups.size > 0 && memoryGroups.size > 0) {
      const overlaps = [...queryGroups].some((group) =>
        memoryGroups.has(group)
      );

      if (!overlaps) score -= 8;
      else score += 5;
    }

    score += (memory.confidence || 0) * 0.5;

    return { memory, score };
  });

  const ranked = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Remove near-identical values from returned results.
  const unique = [];

  for (const item of ranked) {
    const isDuplicate = unique.some((selected) => {
      const sameKey =
        normalizeText(selected.memory.key) ===
        normalizeText(item.memory.key);

      const similarValue =
        similarity(
          selected.memory.value,
          item.memory.value
        ) >= 0.8;

      const similarTopic =
        similarity(
          selected.memory.topic,
          item.memory.topic
        ) >= 0.5;

      return sameKey || (similarValue && similarTopic);
    });

    if (!isDuplicate) {
      unique.push(item);
    }

    if (unique.length >= safeLimit) break;
  }

  const memories = unique.map((item) => item.memory);

  if (memories.length > 0) {
    await Memory.updateMany(
      {
        _id: { $in: memories.map((memory) => memory._id) },
        userId,
      },
      {
        $set: { lastAccessedAt: new Date() },
      }
    );
  }

  return memories;
}

// ========================================
// 3. UPDATE MEMORY
// ========================================

async function updateMemory({ userId, key, updates }) {
  if (!userId || !key || !updates) {
    throw new Error("userId, key and updates are required.");
  }

  const allowedFields = [
    "type",
    "value",
    "topic",
    "entities",
    "source",
    "confidence",
    "conversationId",
    "isActive",
  ];

  const safeUpdates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      safeUpdates[field] = updates[field];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  return Memory.findOneAndUpdate(
    {
      userId,
      key: normalizeText(key),
      isActive: true,
    },
    { $set: safeUpdates },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );
}

// ========================================
// 4. GET MEMORIES BY TOPIC
// ========================================

async function getMemoriesByTopic({
  userId,
  topic,
  limit = 10,
}) {
  if (!userId || !topic) {
    throw new Error("userId and topic are required.");
  }

  const safeLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    20
  );

  return Memory.find({
    userId,
    topic: new RegExp(escapeRegex(topic), "i"),
    isActive: true,
  })
    .sort({ confidence: -1, updatedAt: -1 })
    .limit(safeLimit)
    .lean();
}

// ========================================
// 5. DEACTIVATE MEMORY
// ========================================

async function deactivateMemory({ userId, key }) {
  if (!userId || !key) {
    throw new Error("userId and key are required.");
  }

  return Memory.findOneAndUpdate(
    {
      userId,
      key: normalizeText(key),
      isActive: true,
    },
    {
      $set: { isActive: false },
    },
    {
      returnDocument: 'after',
    }
  );
}

// ========================================
// EXPORT
// ========================================

module.exports = {
  saveMemory,
  retrieveRelevantMemories,
  updateMemory,
  getMemoriesByTopic,
  deactivateMemory,
};