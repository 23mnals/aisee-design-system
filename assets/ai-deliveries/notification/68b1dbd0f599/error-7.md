# AISEE Notification — selected configuration

Integrate this exact configuration into the user's React project. This document contains all installation instructions; do not ask the user for a private repository or another attachment.

## Selected configuration

```json
{
  "NotificationBell": {
    "dot": true
  },
  "NotificationPanel": {
    "state": "error",
    "showIcons": true,
    "showStatus": true,
    "showActions": false
  },
  "slots": {
    "errorDetail": false
  }
}
```

NotificationBell and NotificationPanel are separate components. Apply their own props independently. slots.errorDetail controls whether items contain error detail content; it is not a panel prop. state is the selected preview state; real loading/errors should come from the application's data source. Preserve the host page structure and the selected options.

## Install automatically

1. Download https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/NotificationBell-68b1dbd0f599a5de561067ea233aba0715a1e4c966bb098933b365aa26a866d1.cjs into a temporary file named .aisee-notification-install.cjs inside the target project. SHA-256: 68b1dbd0f599a5de561067ea233aba0715a1e4c966bb098933b365aa26a866d1. Verify the file before executing it; do not print the archive into chat.
2. Run `node .aisee-notification-install.cjs src/components/aisee/notificationbell` from the target project root (adapt the destination to project conventions). This script unpacks complete source, CSS, original icons and Karla font; it does not install packages and refuses to overwrite different existing files.
3. Read the extracted INTEGRATION.md and index.ts. Import NotificationBell / NotificationPanel from the local index; load styles.css once. Apply the selected configuration above over example defaults; preserve original visuals and bell animation. Remove the temporary installer after use.
4. Use existing React 18+ / ReactDOM with TSX and CSS/SVG/font handling. No AISEE package, Tailwind, shadcn or motion dependency is required. Use a client boundary with SSR. Wire real data and read/all-read/action callbacks, opening, outside-click and Escape closure. Review shared base/token styles against the host.
5. Run the target project's typecheck and build; verify selected options, assets, unread state, keyboard, reduced motion, placement and responsive behavior. If download fails, report the actual error; do not request private repository access or invent a replacement.
