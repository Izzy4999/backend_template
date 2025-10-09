"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTemplate = void 0;
const baseTemplate = (title, content) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f6f6f6;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px;">
      <h2 style="color: #333;">${title}</h2>
      <p style="color: #555; font-size: 15px;">${content}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 13px; color: #888;">&copy; ${new Date().getFullYear()} My App</p>
    </div>
  </div>
`;
exports.baseTemplate = baseTemplate;
