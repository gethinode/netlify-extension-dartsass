import {
  Card,
  CardLoader,
  CardTitle,
  Form,
  FormField,
  TeamConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";
import { TeamConfigSchema } from "../../schema/team-config.js";
import { trpc } from "../trpc.js";
import logoImg from "../../assets/netlify-logo.png";

export const TeamConfiguration = () => {
  const sdk = useNetlifySDK();
  const trpcUtils = trpc.useUtils();
  const teamSettingsQuery = trpc.teamSettings.query.useQuery();
  const teamSettingsMutation = trpc.teamSettings.mutate.useMutation({
    onSuccess: async () => {
      await trpcUtils.teamSettings.query.invalidate();
    },
  });

  if (teamSettingsQuery.isLoading) {
    return <CardLoader />;
  }

  return (
    <TeamConfigurationSurface>
      <Card>
        <img src={logoImg} />
        <CardTitle>Team Configuration for {sdk.extension.name}</CardTitle>
        <Form
          defaultValues={
            teamSettingsQuery.data ?? {
              dartsassVersion: "1.97.0",
            }
          }
          schema={TeamConfigSchema}
          onSubmit={teamSettingsMutation.mutateAsync}
        >
          <FormField
            name="dartsassVersion"
            type="text"
            label="Dart Sass Version"
            helpText="Semantic version of the Dart Sass SDK to install, excluding 'v' prefix."
          />
        </Form>
      </Card>
    </TeamConfigurationSurface>
  );
};
