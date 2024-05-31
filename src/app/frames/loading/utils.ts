export function getWarpcastSharableLink(buildersUsername: string[]): string {
  let sharableText = `maybe I just found new frens with my similar social capital score 🤩:\n\n`;
  for (let i = 0; i < buildersUsername.length; i++) {
    if (buildersUsername[i] != "n.a") {
      sharableText += `- @${buildersUsername[i]}\n`;
    }
  }
  let sharableTextUriEncoded = "";
  try {
    sharableTextUriEncoded = encodeURI(sharableText);
  } catch (e) {
    sharableTextUriEncoded = encodeURI("here are my frens:\n\n");
  }
  return `https://warpcast.com/~/compose?text=${sharableTextUriEncoded}`;
}
