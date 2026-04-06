import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";

import { StreamTranscriptItem } from "@/modules/meetings/types";

import { getOpenAiConfig } from "@/lib/openai-config";

import { normalizeOpenAiUrl, parseOpenAiHeaders } from "@/lib/openai-config";

const openAiConfig = getOpenAiConfig();

const summarizer = createAgent({
  name: "summarizer",
  system: `
    You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
  model: openai({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: openAiConfig.baseUrl,
    defaultHeaders: openAiConfig.headers,
  }),
});

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    if (!event.data.transcriptUrl) {
      console.log(
        `[inngest] meetings/processing missing transcriptUrl meetingId=${event.data.meetingId}`
      );
      await step.run("mark-missing-transcript", async () => {
        await db
          .update(meetings)
          .set({
            status: "completed",
            summary: "Missing transcript URL; summary could not be generated. Please confirm Stream transcription is enabled and the webhook is working.",
          })
          .where(eq(meetings.id, event.data.meetingId));
      });
      return;
    }

    const response = await step.run("fetch-transcript", async () => {
      console.log(`[inngest] fetching transcript ${event.data.transcriptUrl}`);
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    let output;
    console.log(
      `[inngest] running summarizer baseUrl=${openAiConfig.baseUrl} headers=${JSON.stringify(
        openAiConfig.headers
      )}`
    );
    try {
      const response = await summarizer.run(
        "Summarize the following transcript: " +
          JSON.stringify(transcriptWithSpeakers)
      );
      output = response.output;
      console.log(`[inngest] summarizer output length=${output.length}`);
    } catch (error) {
      console.error("[inngest] summarizer failed", error);
      throw error;
    }

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId))
    })
    console.log(`[inngest] meetings/processing completed meetingId=${event.data.meetingId}`);
  },
);


