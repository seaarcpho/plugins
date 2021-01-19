import { Context } from "../../types/plugin";

type MyContext = Context & { sceneName?: string };

function extractShootId(originalTitle: string): string | null {
  const sceneIdMatch = originalTitle.match(/ [a-z]+\d+/i); // detect studio prefixes
  const shootId = sceneIdMatch ? sceneIdMatch[0] : null;
  return shootId;
}

module.exports = async (ctx: MyContext): Promise<any> => {
  const { $logger, sceneName, event } = ctx;

  const args = ctx.args as Partial<{
    dry: boolean;
    setName: boolean;
  }>;

  if (!sceneName) {
    $logger.warn(`Invalid event: ${event}`);
    return {};
  }

  const shootId = extractShootId(sceneName);
  if (shootId) {
    $logger.info("Extracted scene ID: " + shootId);

    const result: Record<string, unknown> = {
      custom: {
        "Shoot ID": shootId,
        "Scene ID": shootId,
      },
    };

    if (args.setName) {
      result.name = shootId;
      $logger.verbose("Setting name to shoot ID");
    }

    if (args.dry) {
      $logger.warn(`Would have returned ${ctx.$formatMessage(result)}`);
      return {};
    }
    return result;
  }

  $logger.info("No scene ID found");

  return {};
};
