const { Client } = require("@notionhq/client");

const notionApiKey = process.env.NOTION_API_KEY;
const supportDbId = process.env.NOTION_SUPPORT_DB_ID;

if (!notionApiKey || !supportDbId) {
  console.warn("NOTION_API_KEY o NOTION_SUPPORT_DB_ID no configurados — Notion deshabilitado.");
}

const notion = notionApiKey && supportDbId ? new Client({ auth: notionApiKey }) : null;

async function createSupportTicket({ name, email, message }) {
  if (!notion) {
    console.log("[Notion] Saltando creación de ticket (no configurado)");
    return;
  }
  try {
    await notion.pages.create({
      parent: { database_id: supportDbId },
      properties: {
        Name: { title: [{ text: { content: `Ticket de ${name}` } }] },
        Email: { email },
        Estado: { select: { name: "Nuevo" } }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ type: "text", text: { content: message } }] }
        }
      ]
    });
  } catch (err) {
    console.error("[Notion] Error creando ticket:", err);
  }
}

module.exports = { createSupportTicket };
