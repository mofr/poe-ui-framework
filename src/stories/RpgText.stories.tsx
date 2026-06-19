import type { Meta, StoryObj } from "@storybook/react";
import { RpgText } from "../components/primitives/RpgText";
import { SvgRpgText } from "../components/primitives/SvgRpgText";

const meta: Meta = {
  title: "Primitives/RpgText",
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#080705" },
        { name: "panel", value: "#14100a" },
      ],
    },
  },
};

export default meta;

type Story = StoryObj;

export const ReferenceLikeText: Story = {
  render: () => (
    <div className="rpg-text-root" style={{ padding: 32, background: "radial-gradient(circle at 30% 20%, #1b150c, #050403 70%)", minHeight: "100vh" }}>
      <div style={{ display: "grid", gap: 18, maxWidth: 900 }}>
        <div>
          <RpgText variant="profileName" tone="white">gaearon</RpgText>
          <br />
          <RpgText variant="subtitle" tone="blue" fx="painted">The Interface Mage</RpgText>
        </div>

        <div>
          <RpgText variant="pageTitle" tone="white">react</RpgText>{" "}
          <span className="rpg-chip"><RpgText variant="badge" tone="blue" fx="soft">Public</RpgText></span>
          <br />
          <RpgText variant="body" tone="main">The library for web and native user interfaces.</RpgText>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <RpgText variant="sectionTitle">Contribution Health</RpgText>
          <RpgText variant="panelTitle">Combat Log (Recent Commits)</RpgText>
          <RpgText variant="bottomAction">View All Quests</RpgText>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div>
            <RpgText variant="code" tone="blue">9f3c1ab</RpgText>{" "}
            <RpgText variant="bodySmall">feat: improve server component support</RpgText>{" "}
            <RpgText variant="statNumber" tone="green">+245</RpgText>
          </div>
          <div>
            <RpgText variant="code" tone="blue">b7e2d9a</RpgText>{" "}
            <RpgText variant="bodySmall">fix: hydration mismatch warning</RpgText>{" "}
            <RpgText variant="statNumber" tone="red">-18</RpgText>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8 }}><RpgText variant="panelTitle">SVG text for hero/static labels</RpgText></div>
          <SvgRpgText text="Contribution Health" tone="gold" size={18} />
          <br />
          <SvgRpgText text="The Interface Mage" tone="blue" size={18} />
        </div>
      </div>
    </div>
  ),
};
